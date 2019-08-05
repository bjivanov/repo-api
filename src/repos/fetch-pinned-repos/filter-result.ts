import { ResponseQuery } from "../../utils/response-query";

export function filterResult(reposQuery: ResponseQuery) {
  return function (result) {
    console.log(reposQuery);
    if (reposQuery.filter) {
      const data = result.data.filter(item => {
        const filter = reposQuery.filter || {};
        const keys = Object.keys(filter);
        return keys.every(field => {
          const values = filter[field];
          if (values.length === 1) {
            if (typeof item[field] === 'string') {
              return item[field].indexOf(filter[field]) >= 0
            }
            if (typeof item[field] === 'string') {
              return item[field].indexOf(filter[field]) >= 0
            }
            if (typeof item[field] === 'number') {
              return item[field] === Number(filter[field]);
            }
            return item[field] === filter[field];
          }
          // else - range
          const [min, max] = values;
          return (!min || item[field] >= Number(min))
            && (!max || item[field] <= Number(max));
        });
      });
      return {
        ...result,
        totalCount: data.length,
        data
      };
    }
    return result;
  }
}