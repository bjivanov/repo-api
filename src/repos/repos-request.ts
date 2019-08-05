import * as rp from 'request-promise';
import { GITHUB_TOKEN } from '../utils/constants';

const reposRequest = rp.defaults({
  baseUrl: 'https://api.github.com',
  json: true,
  headers: {
    'User-Agent': 'Pinned-Repos-App',
    'Authorization': `Bearer ${GITHUB_TOKEN}`
  }
});

const queryGraphQl = query => {
  return reposRequest.post({ url: `/graphql`, body: { query } })
}

export { reposRequest, queryGraphQl };