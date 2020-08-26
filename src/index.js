const Promise = require('bluebird');

const codefreshApi = require('./codefresh.api');
const pullRequest = require('./pull-request');

async function execute() {

    const pullRequests = await pullRequest.get();

    console.log(`Retrieve prs ${JSON.stringify(pullRequests)}`);


    const prsResult = await Promise.all(pullRequests.map(pr => {
        return codefreshApi.createPullRequest(pr);
    }));

    console.log(`PR annotations store ${JSON.stringify(prsResult)}`);
}
execute()
    .catch(e => {
        console.error(e.message)
    });
