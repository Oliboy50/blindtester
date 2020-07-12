# blindtester

> Send a video URL (e.g. YouTube) => Get a blindtest

[![CircleCI](https://circleci.com/gh/Oliboy50/blindtester.svg?style=svg)](https://circleci.com/gh/Oliboy50/blindtester)

## User documentation

### Install

#### Local

1. `cp docker-compose.dev.yaml docker-compose.override.yaml`
1. Edit `docker-compose.override.yaml` file to setup your environment variables
1. `docker-compose up`
1. Go to http://localhost:3030 to make sure blindtester is up and running

#### Heroku

1. Create a new app with a pipeline on heroku (e.g. `MY_APP`)
1. `heroku login`
1. `heroku stack:set container --app MY_APP`
1. `heroku git:remote --app MY_APP`
1. `git push heroku master`
1. Go to https://dashboard.heroku.com/apps/MY_APP/settings to setup your environment variables
1. Go to https://MY_APP.herokuapp.com to make sure blindtester is up and running

### Usage

#### GET `/save?url=YOUR_VIDEO_URL`

Produce a new blind test using the `url` query param, then redirect to the blind test.

#### GET `/stream/BLIND_TEST_ID`

Listen to the given blind test id.

### Configuration

Configuration is done using environment variables (some good defaults can be found in [docker-compose.dev.yaml](docker-compose.dev.yaml)) which are listed below:

| Variable    | Description |
|:-----------:|-------------|
| PORT | Port on which the web server will listen (default value is `3030`) |
| API_BASE_URL | Your blindtester installation base URL used to programmatically build links (example: `http://localhost:3030`) |
| ENDPOINT_SAVE_ENABLED | If equals to `true`, the API will expose the `save` endpoint |
| ENDPOINT_STREAM_ENABLED | If equals to `true`, the API will expose the `stream` endpoint |
| ENDPOINT_SLACK_ENABLED | If equals to `true`, the API will expose special endpoints to be compatible with Slack. |
| VALIDATE_MAX_FILE_DURATION_IN_SECONDS | If set, blindtester will make sure the file duration is less than this limit before downloading it. |
| DATABASE_TYPE | Database type. Could be one of `json` (will store application data in a JSON object). |
| DATABASE_JSON_TYPE | Used if `DATABASE_TYPE` is `json`. Could be one of `filesystem` |
| DATABASE_JSON_FILESYSTEM_PATH | Used if `DATABASE_JSON_TYPE` is `filesystem`. Path to a readable/writable file which will be created (if it does not already exist) and used as database. |
| DATABASE_JSON_BACKBLAZEB2_KEY_ID | Used if `DATABASE_JSON_TYPE` is `backblazeb2`. Backblaze B2 key ID used to access the bucket containing the database. More information: [b2_authorize_account](https://www.backblaze.com/b2/docs/b2_authorize_account.html) |
| DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY | Used if `DATABASE_JSON_TYPE` is `backblazeb2`. Backblaze B2 application key used to access the bucket containing the database. More information: [b2_authorize_account](https://www.backblaze.com/b2/docs/b2_authorize_account.html) |
| DATABASE_JSON_BACKBLAZEB2_BUCKET_ID | Used if `DATABASE_JSON_TYPE` is `backblazeb2`. Backblaze B2 bucket ID where database will be stored. More information: [b2_update_bucket](https://www.backblaze.com/b2/docs/b2_update_bucket.html) |
| DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME | Used if `DATABASE_JSON_TYPE` is `backblazeb2`. Backblaze B2 bucket name where database will be stored. More information: [b2_download_file_by_name](https://www.backblaze.com/b2/docs/b2_download_file_by_name.html) |
| DATABASE_JSON_BACKBLAZEB2_FILE_NAME | Used if `DATABASE_JSON_TYPE` is `backblazeb2`. Name of the file containing the JSON database in the bucket. More information: [b2_download_file_by_name](https://www.backblaze.com/b2/docs/b2_download_file_by_name.html) |
| FILES_STORAGE_TYPE | Files storage type. Could be one of `filesystem`, `backblazeb2` |
| FILES_STORAGE_FILESYSTEM_PATH | Path to a readable/writable directory which will be created (if it does not already exist) and used to store extracted audio files |
| FILES_STORAGE_BACKBLAZEB2_KEY_ID | Used if `FILES_STORAGE_TYPE` is `backblazeb2`. Backblaze B2 key ID used to access the bucket containing the audio files. More information: [b2_authorize_account](https://www.backblaze.com/b2/docs/b2_authorize_account.html) |
| FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY | Used if `FILES_STORAGE_TYPE` is `backblazeb2`. Backblaze B2 application key used to access the bucket containing the audio files. More information: [b2_authorize_account](https://www.backblaze.com/b2/docs/b2_authorize_account.html) |
| FILES_STORAGE_BACKBLAZEB2_BUCKET_ID | Used if `FILES_STORAGE_TYPE` is `backblazeb2`. Backblaze B2 bucket ID where audio files will be stored. More information: [b2_update_bucket](https://www.backblaze.com/b2/docs/b2_update_bucket.html) |
| SLACK_CLIENT_ID | Used if `ENDPOINT_SLACK_ENABLED` is `true`. Your Slack application "Client ID". |
| SLACK_CLIENT_SECRET | Used if `ENDPOINT_SLACK_ENABLED` is `true`. Your Slack application "Client Secret". |
| SLACK_VERIFICATION_TOKEN | Used if `ENDPOINT_SLACK_ENABLED` is `true`. If defined, this value must match your Slack application "Verification Token" to make sure incoming requests come from your Slack application. More information: [Slack verification token](https://api.slack.com/docs/token-types#verification) |
| SLACK_SLACK_BUTTON_STATE | Used if `ENDPOINT_SLACK_ENABLED` is `true`. If defined, this value must be the same as the `state` query param used in the request used to distribute your Slack application in a Slack workspace (e.g. `https://slack.com/oauth/authorize?client_id=YOUR_SLACK_CLIENT_ID&scope=commands&state=YOUR_SLACK_SLACK_BUTTON_STATE`). More information: [Slack button](https://api.slack.com/docs/slack-button) |

### Third party integrations

#### Slack

In order to be easily used in Slack, blindtester provides special endpoints.

Here's how to create a blindtester Slack application:

1. Configure `ENDPOINT_SLACK_ENABLED` blindtester variable to expose Slack endpoints
1. [Create a Slack App](https://api.slack.com/apps) from your workspace
1. Create a `Slash Command` for your app where `Request URL` will point to the `API_BASE_URL/slack-command` endpoint of your blindtester installation and `Escape channels, users, and links sent to your app` will be checked
1. `Install App` to your workspace

If you want to distribute your application to other workspaces:

1. Configure `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET` blindtester variables using your Slack application credentials
1. Add a `Redirect URL` which will point to the `API_BASE_URL/slack-oauth-slack-button` endpoint of your blindtester installation
1. `Activate Public Distribution`
1. Use your `Add to Slack` button to install the app to other workspaces

## Developer documentation

### Start hacking

```shell
cp docker-compose.dev.yaml docker-compose.override.yaml

# edit docker-compose.override.yaml file to setup your environment variables and uncomment the last lines of the file to run in "development" environment

# download "node_modules" locally for a better developer experience (smarter IDE, fix lint on commit, etc.)
cd api && npm install && cd -

docker-compose up
```

### Lint

If you've run `npm install` locally (outside of the container running the app), you should already have the "fix lint on commit" feature available.

If you want to lint your code manually:

```shell
# while docker-compose is up

docker-compose exec api npm run lint:fix
```

### Test

```shell
# while docker-compose is up

docker-compose exec api npm run test
```

## License

GPLv3 - See [LICENSE.md](LICENSE.md) file.
