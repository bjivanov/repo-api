import * as NodeCache from 'node-cache';

const githubCache = new NodeCache({ stdTTL: 60 * 30, checkperiod: 0.2 * 60 * 30 });

export function getCached(key: string, dataPromise: () => Promise<any>): Promise<any> {
  let response = githubCache.get(key);
  let promised;
  if (!response) {
    promised = dataPromise()
      .then(result => {
        githubCache.set(key, result);
        return result;
      });
  } else {
    promised = Promise.resolve(response);
  }
  return promised;
}