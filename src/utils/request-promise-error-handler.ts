import { StatusCodeError } from 'request-promise/errors';

export function handleError(req, res) {
  return function(err) {
    if( err instanceof StatusCodeError) {
      res.status(err.statusCode).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
}