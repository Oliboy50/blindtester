# blindtester

> Send a video URL (e.g. YouTube) => Get a blindtest

## User documentation

### Configuration

Configuration is done using environment variables (some good defaults can be found in [docker-compose.local.yaml](docker-compose.local.yaml)) which are listed below:

| Variable    | Description |
|:-----------:|-------------|
| PORT | Port on which the web server will listen (default value is `3030`) |
| NODE_ENV | Environment type. Could be one of `production`, `development` |
| API_BASE_URL | WebApp base URL displayed to end users |
| ENDPOINT_SAVE_ENABLED | If equals to `true`, the API will expose the `save` endpoint |
| ENDPOINT_STREAM_ENABLED | If equals to `true`, the API will expose the `stream` endpoint |
| DATABASE_TYPE | Database type. Could be one of `json` |
| DATABASE_JSON_TYPE | Database JSON type. Could be one of `filesystem` |
| DATABASE_JSON_FILESYSTEM_PATH | Used if `DATABASE_TYPE` is `json`. Path to a readable/writable file which will be created (if it does not already exist) and used as a single JSON object to store application data |
| FILES_STORAGE_TYPE | Files storage type. Could be one of `filesystem`, `backblazeb2` |
| FILES_STORAGE_FILESYSTEM_PATH | Path to a readable/writable directory which will be created (if it does not already exist) and used to store extracted audio files |
| FILES_STORAGE_BACKBLAZEB2_KEY_ID | Used if `FILES_STORAGE_TYPE` is `backblazeb2`. Backblaze B2 key ID used to access the bucket. More information: [b2_authorize_account](https://www.backblaze.com/b2/docs/b2_authorize_account.html) |
| FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY | Used if `FILES_STORAGE_TYPE` is `backblazeb2`. Backblaze B2 application key used to access the bucket. More information: [b2_authorize_account](https://www.backblaze.com/b2/docs/b2_authorize_account.html) |
| FILES_STORAGE_BACKBLAZEB2_BUCKET_ID | Used if `FILES_STORAGE_TYPE` is `backblazeb2`. Backblaze B2 bucket ID where audio files will be stored. More information: [b2_update_bucket](https://www.backblaze.com/b2/docs/b2_update_bucket.html) |
| SLACK_ENABLED | If equals to `true`, the API will expose special endpoints to be compatible with Slack. |
| SLACK_CLIENT_ID | Used if `SLACK_ENABLED` is `true`. Your Slack application "Client ID". |
| SLACK_CLIENT_SECRET | Used if `SLACK_ENABLED` is `true`. Your Slack application "Client Secret". |
| SLACK_VERIFICATION_TOKEN | Used if `SLACK_ENABLED` is `true`. If defined, this value must match your Slack application "Verification Token" to make sure incoming requests come from your Slack application. More information: [Slack verification token](https://api.slack.com/docs/token-types#verification) |
| SLACK_SLACK_BUTTON_STATE | Used if `SLACK_ENABLED` is `true`. If defined, this value must be the same as the `state` query param used in the request used to distribute your Slack application in a Slack workspace (e.g. `https://slack.com/oauth/authorize?client_id=YOUR_SLACK_CLIENT_ID&scope=commands&state=YOUR_SLACK_SLACK_BUTTON_STATE`). More information: [Slack button](https://api.slack.com/docs/slack-button) |

## Developer documentation

### Start hacking

```shell
cp docker-compose.local.yaml docker-compose.override.yaml

# edit docker-compose.override.yaml file to your need

docker-compose up
```

### Project pieces

#### API

Developed on top of [Feathers](https://feathersjs.com)
