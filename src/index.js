const Promise = require('bluebird');
const chalk = require('chalk');
const { image } = require('./configuration');
const codefreshApi = require('./codefresh.api');
const pullRequest = require('./pull-request');

async function execute() {

    const pullRequests = await pullRequest.get();

    console.log(chalk.green(`Retrieve prs ${JSON.stringify(pullRequests)}`));

    let isFailed = false;

    await Promise.all(pullRequests.map(async pr => {
        try {
            const result = await codefreshApi.createPullRequest(pr);
            if (!result) {
                console.log(`Failed to assign pull request ${pr.number} to your image ${image}, please check image reference}`);
                isFailed = true;
            } else {
                console.log(chalk.green(`Codefresh assign pr ${pr.number} to your image ${image}`));
            }
        } catch(e) {
            console.log(`Failed to assign pull request ${pr.number} to your image ${image}, reason ${chalk.red(e.message)}`);
            isFailed = true;
        }
    }));

    if(isFailed) {
        process.exit(1);
    }
}
execute()
    .catch(e => {
        console.log(chalk.red(e.message));
        process.exit(1);
    });
