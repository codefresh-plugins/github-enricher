const { host, apiToken, image, branch } = require('./configuration');
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

}

module.exports = new CodefreshAPI();
