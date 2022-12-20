const { host, apiToken, image, branch } = require('./configuration');
const { GraphQLClient, gql } = require('graphql-request');
const rp = require('request-promise');
const _ = require('lodash');
const chalk = require('chalk');

class CodefreshAPI {
    _handleError(e) {
        if (_.get(e, 'error.message')) {
            const code = _.get(e, 'error.code')
            const statusCode = _.get(e, 'error.status')
            const message = _.get(e, 'error.message')
            throw new Error(`Codefresh error ${statusCode} [${code}]: ${message}`)
        }

        throw e
    }

    async getContext(name) {
        try {
            return await rp({
                method: 'GET',
                uri: `${host}/api/contexts/${name}?decrypt=true`,
                headers: {
                    'Authorization': `Bearer ${apiToken}`
                },
                json: true
            });
        } catch (e) {
            return this._handleError(e);
        }
    }

    async getUserInfo() {
        try {
            return await rp({
                method: 'GET',
                uri: `${host}/api/user`,
                headers: {
                    'Authorization': `Bearer ${apiToken}`
                },
                json: true
            });
        } catch (e) {
            return this._handleError(e);
        }
    }

    async shouldReportToGitops() {
        const user = await this.getUserInfo();
        const accountName = _.get(user, 'activeAccountName');
        const accounts = _.get(user, 'account', []);
        const activeAccount = _.find(accounts, (account) => account.name === accountName);
        return _.get(activeAccount, 'features.gitopsImageReporting', false);
    }

    async createPullRequest(pullRequest) {

        console.log(chalk.green(`Create pull request ${pullRequest.number}=${pullRequest.url}, image ${image}`));

        try {
            return await rp({
                method: 'POST',
                uri: `${host}/api/annotations`,
                body: {
                    entityId: image,
                    entityType: 'image-prs',
                    key: `#${pullRequest.number}`,
                    value: {
                        url: pullRequest.url,
                        title: pullRequest.title,
                        committers: pullRequest.committers
                    },
                    bigValue: {
                        firstCommitDate: pullRequest.firstCommitDate,
                        lastCommitDate: pullRequest.lastCommitDate,
                        prDate: pullRequest.prDate,
                        branch,
                        commits: pullRequest.commits,
                    }
                },
                headers: {
                    'Authorization': `Bearer ${apiToken}`
                },
                json: true
            });
        } catch (e) {
            return this._handleError(e);
        }
    }

    async createPullRequestForGitops(imageName,  pullRequest) {
        console.log(chalk.green(`creating pull request annotation ${pullRequest.number}=${pullRequest.url}`));
        try {
            const saveAnnotationMutation = gql`mutation saveAnnotation($annotation: AnnotationArgs!) {
                saveAnnotation(annotation: $annotation)
            }`;
            const vars = {
                annotation: {
                    logicEntityId: { id: imageName },
                    entityType: 'image',
                    key: `#${pullRequest.number}`,
                    type: 'pr',
                    pullRequestValue: {
                        url: pullRequest.url,
                        title: pullRequest.title,
                        committers: pullRequest.committers,
                        commits: pullRequest.commits.map(c => ({
                            url: c.url,
                            userName: c.userName,
                            sha: c.sha,
                            message: c.message,
                            commitDate: c.commitDate
                        }))
                    }
                }
            };
            const res = await this._doGraphqlRequest(saveAnnotationMutation, vars);
            return res;
        } catch (e) {
            this._handleError(e, 'Failed to create pr annotation');
        }
    }

    async _doGraphqlRequest(query, variables) {
        const graphQLClient = new GraphQLClient(`${host}/2.0/api/graphql`, {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
        });

        return await graphQLClient.request(query, variables);
    }

}

module.exports = new CodefreshAPI();
