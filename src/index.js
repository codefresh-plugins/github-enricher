const _ = require('lodash');
const chalk = require('chalk');
const { imageEnricherGitInfo } = require('@codefresh-io/cf-report-image-toolbox');
const config = require('./configuration');
const pullRequest = require('./pull-request');
const { providers } = require('./configuration/types');
const CodefreshAPI = require('./codefresh.api');

const PLATFORM = {
    CLASSIC: 'CLASSIC'
};

const GIT_CONTEXT_TYPE_PREFIX = 'git.'

async function getGitCredentials(codefreshAPI, gitContext) {
    try {
        if(!gitContext){
            return null
        }
        const context = await codefreshAPI.getContext(gitContext);
        const contextType = _.get(context, 'spec.type', '');
        if (contextType===`${GIT_CONTEXT_TYPE_PREFIX}${providers.GERRIT}`) {
            return {
                provider: providers.GERRIT,
                gerritHost: _.get(context,'spec.data.auth.apiHost'),
                gerritUsername: _.get(context,'spec.data.auth.username'),
                gerritPassword: _.get(context,'spec.data.auth.password'),
            }
        }
        if (contextType===`${GIT_CONTEXT_TYPE_PREFIX}${providers.GITHUB}`) {
            return {
                provider: providers.GITHUB,
                githubToken: _.get(context, 'spec.data.auth.password'),
                githubApiPathPrefix: _.get(context, 'spec.data.auth.apiPathPrefix', '/'),
                githubApiHost: _.get(context, 'spec.data.auth.apiHost', 'api.github.com'),
            }
        }
        return null
    } catch (error) {
        console.error(`Can't get git context. Error: ${error.message}`)
    }
    return null
}

async function execute() {
    const pullRequests = await pullRequest.get()
      .catch((error) => {
          console.log(chalk.yellow(`Can't use event file, reason ${error.message}`));
      });

    if (pullRequests) {
        console.log(chalk.green(`Prs from event file ${JSON.stringify(pullRequests)}`));
    }

    const codefreshAPI = new CodefreshAPI(config.host, config.apiToken);
    const context = await getGitCredentials(codefreshAPI, config.contextName);
    const provider = _.get(context, 'provider') || config.provider;
    const inputs = {
        platform: PLATFORM.CLASSIC,
        cfApiKey: config.apiToken,
        cfHost: config.host,
        imageName: config.image,
        gitContext: config.contextName,
        provider,
        ...(pullRequests && { eventFilePR: pullRequests }),
        branch: config.branch,
        repo: config.repo,
        revision: config.revision,
        commitsByUserLimit: config.commitsByUserLimit,
        gerritChangeId: config.gerritChangeId
    }
    if (provider === providers.GERRIT) {
        inputs.gerritHost = _.get(context, 'gerritHost') || config.gerritHost;
        inputs.gerritUsername = _.get(context, 'gerritUsername') || config.gerritUsername;
        inputs.gerritPassword = _.get(context, 'gerritPassword') || config.gerritPassword;
    }
    if (provider === providers.GITHUB) {
        inputs.githubApiHost = _.get(context, 'githubApiHost') || config.githubHost;
        inputs.githubApiPathPrefix = _.get(context, 'githubApiPathPrefix') || config.githubApiPathPrefix;
        inputs.githubToken = _.get(context, 'githubToken') || config.githubToken;
    }

    await imageEnricherGitInfo(inputs);
}

execute()
    .catch(e => {
        console.log(chalk.red(e.message));
        process.exit(1);
    });
