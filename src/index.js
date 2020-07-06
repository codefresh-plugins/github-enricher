const Promise = require('bluebird');

const GithubEnricher = require('./github-enricher');
const codefreshApi = require('./codefresh.api');

const configuration = require('./configuration');

async function execute() {

    const githubEnricher = new GithubEnricher(configuration.branch, configuration.repo, 'open');
    const pullRequests = await githubEnricher.pullRequests();
    console.log(`Retrieve prs ${JSON.stringify(pullRequests)}`);


    const prsResult = await Promise.all(pullRequests.map(pr => {
        return codefreshApi.createPullRequest(pr);
    }));

    console.log(`PR annotations store ${JSON.stringify(prsResult)}`);
}
execute();