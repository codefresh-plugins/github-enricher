const chalk = require('chalk');
const { imageEnricherGitInfo } = require('@codefresh-io/cf-report-image-toolbox');
const config = require('./configuration');
const pullRequest = require('./pull-request');

const PLATFORM = {
    CLASSIC: 'CLASSIC'
};

async function execute() {
    const pullRequests = await pullRequest.get()
      .catch((error) => {
          console.log(chalk.yellow(`Can't use event file, reason ${error.message}`));
      });

    if (pullRequests) {
        console.log(chalk.green(`Prs from event file ${JSON.stringify(pullRequests)}`));
    }

    await imageEnricherGitInfo({
        platform: PLATFORM.CLASSIC,
        cfApiKey: config.apiToken,
        cfHost: config.host,
        imageName: config.image,
        gitContext: config.contextName,
        provider: config.provider,
        ...(pullRequests && { eventFilePR: pullRequests }),
        githubApiHost: config.githubHost,
        githubToken: config.githubToken,
        branch: config.branch,
        repo: config.repo,
        revision: config.revision,
        commitsByUserLimit: config.commitsByUserLimit,
    });
}

execute()
    .catch(e => {
        console.log(chalk.red(e.message));
        process.exit(1);
    });
