const Promise = require('bluebird');
const chalk = require('chalk');

const codefreshApi = require('./codefresh.api');
const pullRequest = require('./pull-request');

async function execute() {

    const pullRequests = await pullRequest.get();

    console.log(chalk.green(`Retrieve prs ${JSON.stringify(pullRequests)}`));


    const prsResult = await Promise.all(pullRequests.map(pr => {
        return codefreshApi.createPullRequest(pr);
    }));

    console.log(chalk.green(`PR annotations store ${JSON.stringify(prsResult)}`));
}
execute()
    .catch(e => {
        console.log(chalk.red(e.message));
    });
