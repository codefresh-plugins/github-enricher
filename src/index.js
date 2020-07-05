const Promise = require('bluebird');

const GithubEnricher = require('./github-enricher');
const codefreshApi = require('./codefresh.api');

const configuration = require('./configuration');

async function execute() {

    const githubEnricher = new GithubEnricher('SAAS-7739-try2', 'codefresh-io/cf-api', 'open');
    const pullRequests = await githubEnricher.pullRequests();
    const issues = await githubEnricher.issues(pullRequests.map(pr => pr.number));
    console.log(`Retrieve prs ${JSON.stringify(pullRequests)}`);
    console.log(`Retrieve issues ${JSON.stringify(issues)}`);


    await Promise.all(pullRequests.map(pr => {
        return codefreshApi.createPullRequest(pr);
    }));

    await Promise.all(issues.map(issue => {
        return codefreshApi.createIssue(issue);
    }));
    
    
}
execute();