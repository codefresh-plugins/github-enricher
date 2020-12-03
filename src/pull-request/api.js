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
            const result = {
                number: pr.number,
                url: `https://github.com/${repo}/pull/${pr.number}`,
                title: pr.title,
            }
            if(pr.user) {
                result.committer = {
                    userName: pr.user.login,
                    avatar: pr.user.avatar_url,
                }
            }
            return result;
        });
    }

    async pullCommits(pullNumber) {
        const {repo} = configuration;

        try {
            const commits = await octokit.request(`GET /repos/${repo}/pulls/${pullNumber}/commits`)

            return {
                [pullNumber]: commits.data.map(c => {
                    return {
                        sha: c.sha,
                        message: c.commit.message,
                        url: c.commit.url,
                        author: c.commit.author
                    }
                })
            }
        } catch (e) {
            console.log(chalk.yellow(`Couldn't get commits for PR ${pullNumber} in ${repo}`))
            console.log(chalk.yellow(e.toString()))
            return {
                [pullNumber]: []
            }
        }
    }
}
module.exports = new Api();
