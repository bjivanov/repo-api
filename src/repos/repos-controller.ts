
import * as parse from 'parse-link-header';

import { reposRequest, queryGraphQl } from './repos-request';
import { handleError } from '../utils/request-promise-error-handler';
import { getPinnedReposQuery } from './fetch-pinned-repos/graphql-query';
import { mapGraphqlResponser } from './fetch-pinned-repos/graphql-response-mapper';
import { GITHUB_ORGANIZATION } from '../utils/constants';
import { addContributors } from './fetch-pinned-repos/add-contributors';
import { filterResult } from './fetch-pinned-repos/filter-result';
import { sortResult } from './fetch-pinned-repos/sort-result';
import { pageResult } from './fetch-pinned-repos/page-result';
import { getCached } from './get-cached';

export function pinnedReposPost(req, res) {
  // as github supports up to 6 pinned items per user/org, we'll be querying for all of them 
  getCached(
    'pinned-repos',
    () => queryGraphQl(getPinnedReposQuery(GITHUB_ORGANIZATION))
      .then(mapGraphqlResponser)
      .then(addContributors)
  )
    .then(filterResult(req.body))
    .then(sortResult(req.body))
    .then(pageResult(req.body))
    .then(result => {
      res.json(result)
    })
    .catch(handleError(req, res));
}

export function repoReadmeGet(req, res) {
  const headers = {
    'Accept': 'application/vnd.github.v3.raw'
  };

  getCached(
    `repo-readme-${req.params.repo}`,
    () => reposRequest.get(`/repos/${GITHUB_ORGANIZATION}/${req.params.repo}/readme`, { headers })
  )
    .then(result => {
      res.send(result);
    })
    .catch(handleError(req, res));
}

export function repoPackageJsonGet(req, res) {
  const headers = {
    'Accept': 'application/vnd.github.v3.raw'
  };

  getCached(
    `repo-packagejson-${req.params.repo}`,
    () => reposRequest.get(`/repos/${GITHUB_ORGANIZATION}/${req.params.repo}/contents/package.json`, { headers })
  )
    .then(result => {
      res.send(result);
    })
    .catch(handleError(req, res));
}

export function repoCommitsGet(req, res) {
  const getUrl = (perPage, page) => `/repos/${GITHUB_ORGANIZATION}/${req.params.repo}/commits?per_page=${perPage}&page=${page}`;
  getCached(
    `repo-commits-${req.params.repo}-total`,
    () => reposRequest.head(getUrl(1, 1))
      .then(result => {
        const parsedLinkHeader = parse(result.link);
        return parsedLinkHeader.last.page;
      })
  ).then(total => {
    const perPage = Number(req.query.take) || 30;
    const page = Math.floor(Number(req.query.skip) / perPage) + 1; //skipped items / per page = nr of pages (adding 1 to start from page 1)

    return getCached(
      `repo-commits-${req.params.repo}-${perPage}-${page}`,
      () => reposRequest(getUrl(perPage, page))
        .then(result => {
          return {
            totalCount: Number(total),
            data: result.map(item => ({
              sha: item.sha,
              comment: item.commit.message,
              contributor: item.author && item.author.login,
              date: item.commit.author.date
            }))
          };
        })
    )

      .then(result => {
        res.json(result)
      })
      .catch(handleError(req, res));
  });
}

export function repoCommitPatchGet(req, res) {
  res.setHeader('Content-disposition', `attachment; filename=${req.params.repo}_${req.params.sha}.patch`);
  res.setHeader('Content-type', 'application/json');
  const headers = {
    'Accept': 'application/vnd.github.v3.patch'
  };
  getCached(
    `repo-commit-patch-${req.params.repo}-${req.params.sha}`,
    () => reposRequest.get(`/repos/${GITHUB_ORGANIZATION}/${req.params.repo}/commits/${req.params.sha}`, { headers })
  )
    .then(result => {
      res.send(result);
    })
    .catch(handleError(req, res));
}