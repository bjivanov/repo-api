import * as express from 'express';
import {
  pinnedReposPost,
  repoPackageJsonGet,
  repoReadmeGet,
  repoCommitsGet,
  repoCommitPatchGet
} from '../repos/repos-controller';

const router = express.Router();

router.post('/', pinnedReposPost);

router.get('/:repo/readme', repoReadmeGet);

router.get('/:repo/package.json', repoPackageJsonGet);

router.get('/:repo/commits', repoCommitsGet);

router.get('/:repo/commits/:sha/patch', repoCommitPatchGet);

export default router;