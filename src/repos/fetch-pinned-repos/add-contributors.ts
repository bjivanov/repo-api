import { reposRequest } from '../repos-request';
import { GITHUB_ORGANIZATION } from '../../utils/constants';
import * as parse from 'parse-link-header';

async function getContributorsCount(repo: string) {
  const result = await reposRequest.head(`/repos/${GITHUB_ORGANIZATION}/${repo}/contributors?per_page=1&page=1`)
  const parsedLinkHeader = parse(result.link);
  return Number(parsedLinkHeader.last.page);
}

export async function addContributors(result) {
  await Promise.all(
    result.data.map(async repo => {
      repo.contributors = await getContributorsCount(repo.name);
    })
  )
  return result;
}