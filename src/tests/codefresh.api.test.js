const codefreshApi = require('../codefresh.api');

jest.mock('graphql-request', () => {
    return {
        "gql": () => {},
        "GraphQLClient": jest.fn().mockImplementation(() => {
            return {
                request: (query, vars) => {
                    expect(vars).toBeDefined();
                    expect(vars.annotation.logicEntityId).toEqual({"id":"codefresh/test:latest"});
                }
            };
        })
    };
});

jest.mock('request-promise', () => {
    return () => {
        return Promise.resolve({
            activeAccountName: 'test',
            account: [
                {
                    name: 'test2',
                    features: {
                        gitopsImageReporting: false
                    }
                },
                {
                    name: 'test',
                    features: {
                        gitopsImageReporting: true
                    }
                }
            ]
        });
    };
});

test('should get gitopsImageReporting feature flag', async () => {
    const shouldReportToGitops = await codefreshApi.shouldReportToGitops();
    expect(shouldReportToGitops).toBe(true);

});

test('should createPullRequestForGitops', async () => {
    const pr  = {
        "number":3,
        "title":"v4",
        "url":"https://bitbucket.org/test/proj/pull-requests/3",
        "commits": [{
            "url": "test url",
            "userName": "test userName",
            "sha": "test sha",
            "message": "test message",
            commitDate: new Date()
        }]};
    await codefreshApi.createPullRequestForGitops('codefresh/test:latest', pr);

});
