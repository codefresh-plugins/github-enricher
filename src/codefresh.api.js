const { host, apiToken, image } = require('./configuration');
const rp = require('request-promise');

class CodefreshAPI {

    async createPullRequest(pullRequest, imageName) {

        console.log(`Create pull request ${pullRequest.number}=${pullRequest.url}`)

        return rp({
            method: 'POST',
            uri: `${host}/api/annotations`,
            body: {
                entityId: image,
                entityType: 'image-prs',
                key: `#${pullRequest.number}`,
                value: pullRequest.url
            },
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
            json: true
        });
    }

    async createIssue(issue, imageName) {

        console.log(`Create issue request ${issue.number}=${issue.url}`)

        return rp({
            method: 'POST',
            uri: `${host}/api/annotations`,
            body: {
                entityId: image,
                entityType: 'image-issues',
                key: `#${issue.number}`,
                value: issue.url
            },
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
            json: true
        });
    }
}
module.exports = new CodefreshAPI();
