const chalk = require('chalk');

const strategy = require('./strategy');

class PullRequest {

    async get() {
        const { file } = await strategy.getProvider();
        try {
            return await file.pullRequests();
        } catch(e) {
            console.log(chalk.yellow(`PRs in event file not found, reason ${e.message}, will be used api call`));
        }
    }
}
module.exports = new PullRequest();
