# blindtester

> Send a video URL (e.g. YouTube) => Get a blindtest

## User documentation

### Usage

#### Local

```shell
cp docker-compose.local.yaml docker-compose.override.yaml

# edit docker-compose.override.yaml file to fit your need (see "Configuration" section)

docker-compose up
```

### Configuration

Configuration is done using environment variables (some good defaults can be found in [docker-compose.local.yaml](docker-compose.local.yaml)) which are listed below:

| Variable    | Description |
|:-----------:|-------------|
| PORT | Port on which the web server will listen (default value is `3030`) |
| API_BASE_URL | WebApp base URL displayed to end users |
| ENDPOINT_SAVE_ENABLED | If equals to `true`, the API will expose the `save` endpoint |
| ENDPOINT_STREAM_ENABLED | If equals to `true`, the API will expose the `stream` endpoint |
| ENDPOINT_SLACK_ENABLED | If equals to `true`, the API will expose special endpoints to be compatible with Slack. |
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

## Developer documentation

### Start hacking

```shell
cp docker-compose.local.yaml docker-compose.override.yaml

# edit docker-compose.override.yaml file to fit your need (see "Configuration" section)
# optionally uncomment the last lines for a better developer experience

docker-compose up
```

### Project pieces

#### API

Developed on top of [Feathers](https://feathersjs.com)
