const _ = require('lodash');
const { Octokit } = require("@octokit/rest");
const configuration = require('../configuration');

const octokit = new Octokit({
    auth: configuration.githubToken
});

class Api {

    async pullRequests() {
        const { branch, repo } = configuration;
        console.log(`Looking for PRs from ${repo} repo and ${branch} branch`);
        const prs = await octokit.search.issuesAndPullRequests({ q: `head:${branch}+type:pr+repo:${repo}+is:open`  });
        return prs.data.items.map(pr => {
            return {
                number: pr.number,
                url: `https://github.com/${repo}/pull/${pr.number}`
            }
        });
    }

}
module.exports = new Api();
