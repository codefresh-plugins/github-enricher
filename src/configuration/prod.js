const { providers } = require('./types');

module.exports = {
    apiToken: process.env.CF_API_KEY,
    commitsByUserLimit: process.env.CF_COMMITS_BY_USER_LIMIT || 5,
    host: process.env.CF_URL || 'https://g.codefresh.io',
    githubHost: process.env.GITHUB_HOST || 'https://api.github.com',
    image: process.env.IMAGE_SHA,
    branch: process.env.BRANCH,
    repo: process.env.REPO,
    githubToken: process.env.GITHUB_TOKEN,
    workingDirectory: process.env.WORKING_DIRECTORY || '/codefresh/volume',
    contextName: process.env.GIT_PROVIDER_NAME,
    provider: process.env.GIT_PROVIDER || providers.GITHUB,
    revision: process.env.REVISION,
    gerritChangeId: process.env.GERRIT_CHANGE_ID,
    gerritHost: process.env.GERRIT_HOST_URL,
    gerritUsername: process.env.GERRIT_USERNAME,
    gerritPassword: process.env.GERRIT_PASSWORD,
};
