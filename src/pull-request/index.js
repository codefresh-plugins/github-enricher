const api = require('./api');
const file = require('./file');

const chalk = require('chalk');


class PullRequest {

    async get() {
        try {
            return await file.pullRequests();
        } catch(e) {
            console.log(chalk.yellow(`PRs in event file not found, reason ${e.message}, move to provider api call implementation`));
            return await api.pullRequests();
        }
    }

    async enrichWithCommits(prs) {
        const commits = await Promise.all(
            prs.map(({number}) => api.pullCommits(number))
        )

        const map = Object.assign({}, ...commits)

        const enriched = prs.map(pr => {
            return {
                ...pr,
                commits: map[pr.number]
            }
        })

        return enriched
    }
}
module.exports = new PullRequest();
