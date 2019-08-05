export function mapGraphqlResponser(result) {
  return {
    totalCount: result.data.organization.pinnedItems.totalCount,
    data: result.data.organization.pinnedItems.edges
      .map(edge => ({
        name: edge.node.name,
        license: edge.node.licenseInfo && edge.node.licenseInfo.name,
        contributors: 0,
        commits: edge.node.master.commits.totalCount,
        branches: edge.node.branches.totalCount,
        releases: edge.node.releases.totalCount
      }))
  };
}