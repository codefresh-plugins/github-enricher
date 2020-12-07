module.exports = {
    apiToken: process.env.CF_API_KEY,
    commitsByUserLimit: process.env.CF_COMMITS_BY_USER_LIMIT || 5,
    host: process.env.CF_URL || 'https://g.codefresh.io',
    image: process.env.IMAGE_SHA,
    branch: process.env.BRANCH,
    repo: process.env.REPO,
    githubToken: process.env.GITHUB_TOKEN,
    workingDirectory: process.env.WORKING_DIRECTORY || '/codefresh/volume'
};
