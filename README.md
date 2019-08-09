# repo-api

Repo-api is a nodejs/express backend written for [repo-viewer](https://github.com/bjivanov/repo-viewer) Angular application used to display pinned repositories per GitHub organization.

## Initial setup

### Install dependencies
Go to repo-api folder and do `npm install`.

### CORS
Repo-viewer and repo-api can be running on different addresses. For example, in dev mode repo-api is running on http://localhost:3000 and repo-viewer - on http://localhost:4200.
You can whitelist the URL of the repo-viewer app by setting env. variable `REPOS_API_ALLOW_ORIGIN`, which defaults to `http://localhost:4200`

### MongoDb
Repo-api requires mongodb. That's where application users are persisted.
MongoDb connection string can be set using env. variable `REPOS_API_MONGODB_CONNECTION`, which defaults to `mongodb://localhost/repos-api`.
A guide for installing MongoDb can be found [here](https://docs.mongodb.com/manual/installation/).

### Github
Repo-api uses both GitHub GraphQl API v4 and Rest API v3.
In order to use these you need to create an access token in your github account and set it to the env. variable `GITHUB_TOKEN`. Token can be generated [here](https://github.com/settings/tokens).

You can specify the GitHub organization for which you want to see pinned repos by setting env. variable `GITHUB_ORGANIZATION`, which defaults to `vmware`

## npm commands
1. `npm run build`
2. `npm start`
3. `npm run start:watch`