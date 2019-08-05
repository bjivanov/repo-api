import { ResponseQuery } from "../../utils/response-query";

export function pageResult(reposQuery: ResponseQuery) {
  return function (result) {
    const startIdx = reposQuery.skip || 0;
    const length = reposQuery.take;
    return {
      ...result,
      data: result.data.slice(
        startIdx,
        length && startIdx + length
      )
    }
  }
}