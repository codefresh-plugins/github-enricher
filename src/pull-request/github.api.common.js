const {Octokit} = require("@octokit/rest");
const _ = require('lodash');
const configuration = require('../configuration');

const octokit = new Octokit({
    auth: configuration.githubToken
});

class GithubApiCommon {

    async extractCommitsInfo(pullRequestId) {
        const [owner, repo] = configuration.repo.split('/');
        const commitsByUserLimit = configuration.commitsByUserLimit

        const committersMap = {};
        const commitsByUser = {}

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

            for (const commit of commits.data) {
                if (!commit.author) {
                    continue
                }

                const userName = commit.author.login

                committersMap[userName] = {
                    userName,
                    avatar: commit.author.avatar_url,
                }

                if (!commitsByUser[userName]) {
                    commitsByUser[userName] = []
                }

                commitsByUser[userName].push({
                    userName,
                    sha: commit.sha,
                    message: commit.commit.message
                })
            }

            page++;
        }

        for (const userName of Object.keys(commitsByUser)) {
            commitsByUser[userName] = commitsByUser[userName].slice(0, commitsByUserLimit)
        }


        return {
            committers: _.values(committersMap),
            commits: _.flatten(_.values(commitsByUser))
        };
    }


}

module.exports = new GithubApiCommon();
