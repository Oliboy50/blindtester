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
| DATABASE_TYPE | Database type. Could be one of `filesystem` |
| DATABASE_FILESYSTEM_PATH | Used if `DATABASE_TYPE` is `filesystem`. Path to a readable/writable file which will be created (if it does not already exist) and used as a single JSON object |
| FILES_STORAGE_TYPE | Files storage type. Could be one of ["filesystem"] |
| FILES_STORAGE_FILESYSTEM_PATH | Used if `FILES_STORAGE_TYPE` is `filesystem`. Path to a readable/writable directory which will be created (if it does not already exist) and used to store extracted audio files |
| SLACK_CLIENT_ID | Your Slack application "Client ID". |
| SLACK_CLIENT_SECRET | Your Slack application "Client Secret". |
| SLACK_VERIFICATION_TOKEN | If defined, this value must match your Slack application "Verification Token" to make sure incoming requests come from your Slack application. More information: [Slack verification token](https://api.slack.com/docs/token-types#verification) |
| SLACK_SLACK_BUTTON_STATE | If defined, this value must be the same as the `state` query param used in the request used to distribute your Slack application in a Slack workspace (e.g. `https://slack.com/oauth/authorize?client_id=YOUR_SLACK_CLIENT_ID&scope=commands&state=YOUR_SLACK_SLACK_BUTTON_STATE`). More information: [Slack button](https://api.slack.com/docs/slack-button) |

## Developer documentation

### Start hacking

```shell
cp docker-compose.local.yaml docker-compose.override.yaml

# edit docker-compose.override.yaml file to your need (or setup missing env vars locally)

docker-compose up
```

### Project pieces

#### API

Developed on top of [Feathers](https://feathersjs.com)
