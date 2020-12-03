const { Octokit } = require("@octokit/rest");
const _ = require('lodash');
const configuration = require('../configuration');

const octokit = new Octokit({
    auth: configuration.githubToken
});

class GithubApiCommon {

    async committers(pullRequestId) {
        const [owner, repo] = configuration.repo.split('/');

        const committers = {};
        let page = 0;
        while (true) {
            const commits = await octokit.pulls.listCommits({
                owner,
                repo,
                pull_number: pullRequestId,
                page,
            });

            if (commits.data.length === 0) {
                break;
            }

            commits.data.forEach((commit) => {
                committers[commit.author.login] = {
                    userName: commit.author.login,
                    avatar: commit.author.avatar_url,
                }
            })

            page++;
        }


        return _.values(committers);
    }


}
module.exports = new GithubApiCommon();
