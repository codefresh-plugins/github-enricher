const path = require('path');

const { providers } = require('./types');

module.exports = {
    apiToken: process.env.CF_API_KEY,
    commitsByUserLimit: process.env.CF_COMMITS_BY_USER_LIMIT || 5,
    host: process.env.CF_URL || 'https://g.codefresh.io',
    githubHost: process.env.GITHUB_HOST || 'github.com',
    image: process.env.IMAGE_SHA,
    branch: process.env.BRANCH,
    repo: process.env.REPO,
    githubAppId: process.env.GITHUB_APP_ID,
    githubInstallationId: process.env.GITHUB_INSTALLATION_ID,
    githubPrivateKey: process.env.GITHUB_PRIVATE_KEY,
    githubToken: process.env.GITHUB_TOKEN,
    githubApiPathPrefix: process.env.GITHUB_API_PATH_PREFIX,
    workingDirectory: process.env.WORKING_DIRECTORY ||  path.resolve(__dirname + '/../../tests'),
    contextName: process.env.GIT_PROVIDER_NAME,
    provider: process.env.GIT_PROVIDER || providers.GITHUB,
    revision: process.env.REVISION,
    gerritChangeId: process.env.GERRIT_CHANGE_ID,
    gerritHost: process.env.GERRIT_HOST_URL,
    gerritUsername: process.env.GERRIT_USERNAME,
    gerritPassword: process.env.GERRIT_PASSWORD,
};
