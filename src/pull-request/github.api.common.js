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
        const commitsByUser = {};
        let firstCommitDate;

        let page = 1;
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

            if (page === 1) {
                firstCommitDate = commits.data[0].commit.author.date;
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
                    url: commit.url,
                    userName,
                    sha: commit.sha,
                    message: commit.commit.message,
                })
            }

            page++;
        }

        for (const userName of Object.keys(commitsByUser)) {
            commitsByUser[userName] = _.takeRight(commitsByUser[userName], commitsByUserLimit);
        }


        return {
            committers: _.values(committersMap),
            commits: _.flatten(_.values(commitsByUser)),
            firstCommitDate,
        };
    }


}

module.exports = new GithubApiCommon();
