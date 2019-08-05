import { ResponseQuery } from "../../utils/response-query";

export function sortResult(reposQuery: ResponseQuery) {
  return function (result) {
    const field = reposQuery.orderBy;
    if (field) {
      result.data.sort((firstEntry, secondEntry) => {
        let result = 0;
        if (typeof firstEntry[field] === 'number') {
          result = firstEntry[field] - secondEntry[field];
        } else if (typeof firstEntry[field] === 'string') {
          result = firstEntry[field].localeCompare(secondEntry[field]);
        }

        return reposQuery.sortOrder && reposQuery.sortOrder === 'desc'
          ? -1 * result
          : result;
      });
    }
    return result;
  }
}