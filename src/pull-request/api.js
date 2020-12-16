const _ = require('lodash');
const { Octokit } = require("@octokit/rest");
const configuration = require('../configuration');
const githubApiCommon = require('../pull-request/github.api.common');

const octokit = new Octokit({
    auth: configuration.githubToken
});

class Api {

    async pullRequests() {
        const { branch, repo } = configuration;
        console.log(`Looking for PRs from ${repo} repo and ${branch} branch`);
        const prs = await octokit.search.issuesAndPullRequests({ q: `head:${branch}+type:pr+repo:${repo}+is:open`  });
        return Promise.all(prs.data.items.map(async (pr) => {
            const info = await githubApiCommon.extractCommitsInfo(pr.number);

            const result = {
                ...info,
                number: pr.number,
                url: `https://${configuration.githubHost}/${repo}/pull/${pr.number}`,
                title: pr.title,
            }

            return result;
        }));
    }
}
module.exports = new Api();
