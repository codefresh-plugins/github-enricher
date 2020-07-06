const { Octokit } = require("@octokit/rest");
const bluebird = require('bluebird');
const _ = require('lodash');
const configuration = require('./configuration');

const octokit = new Octokit({
    auth: configuration.githubToken
  });


class GithubEnricher {

    constructor(branch, repo, state) {
        this.branch = branch;
        this.repo = repo;
        this.state = state;
    }

    async issues(prNumbers = []) {
        const issues = await octokit.search.issuesAndPullRequests({ q: `type:issues+repo:${this.repo}+is:${this.state}`  });
        return _.compact( await Promise.all(issues.data.items.map(async issue => {
            const contains = prNumbers.every(v => {
                return issue.body.includes(`#${v}`);
            });
            if(!contains) {
                return undefined;
            }

            return {
                number: issue.number,
                url: `https://github.com/${this.repo}/issues/${issue.number}`
            }
        })));
    }

    async pullRequests() {
        const prs = await octokit.search.issuesAndPullRequests({ q: `head:${this.branch}+type:pr+repo:${this.repo}+is:${this.state}`  });
        return prs.data.items.map(pr => {
            return {
                number: pr.number,
                url: `https://github.com/${this.repo}/pull/${pr.number}`
            }
        });
    }

}
module.exports = GithubEnricher;