export function getPinnedReposQuery(organization: string): string {
  return `
  query { 
    organization(login: "${organization}") {
      pinnedItems(last: 10, types: [REPOSITORY]) {
        totalCount
        edges {
          node {
            ... on Repository {
              id
              name
              master: object(expression: "master") {
                ... on Commit {
                  commits: history {
                    totalCount
                  }
                }
              }
              branches: refs(refPrefix: "refs/heads/") {
                totalCount
              }
              licenseInfo {
                name
                url
                key
              }
              releases {
                totalCount
              }
            }
          }
        }
      }
    }
  }
`;
}