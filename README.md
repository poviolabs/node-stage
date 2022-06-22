# Node Stage

Library to manage environment variables and stages.

# Setup

```bash
yarn add node-stage@poviolabs/node-stage#v1

# update
yarn up node-stage@poviolabs/node-stage#v1
```

# Config.yaml Example

```yaml

stages:
  myapp-dev: # one stage per deploy
    
    moduleName:
      variableKey: variableValue
  
    ## dotenv overrides
    # envFiles: [ '.env.myapp-dev.secrets' ]
    ## environment overrides
    # environment:
    #  app__spaDeploy__s3__bucket: myapp-dev-website
```

# Library

```typescript
import { loadConfig } from "node-stage";

const config = await loadConfig("/path/to/config.yaml", process.env.STAGE);
```

# CLI

## Options

### --pwd

Root from where to fetch `config.yaml` and the base for all relative paths.

### --stage

The slug of the deployment (ie. prd/stg/dev). Used in config.yaml.

#### --service

If the stage has multiple services, you can define the one you want to deploy here.

Example configuration

```yaml
stages:
  myapp-prd: &myapp-prd
    yaml_local_override: correct

  myapp-prd-worker:
    <<: *myapp-prd
    stage: myapp-prd
```

#### Overriding config and global prefix

CONFIG_PREFIX=app
CONFIG_FILE=config.yaml

## node-stage env

### node-stage env var \[path-to-variable\]

Fetches the variable at the specified path and returns it.

Example:
```
node-stage env var slackNotify.channelName
```

## node-stage slack

#### Slack message config

```yaml
stages:
  myapp-prd:
    ecs_deploy:
      slackChannel: C03AXDS9F2B
      slackAutolinkPrefix: SP-
      slackAutolinkTarget: https://github.com/poviolabs/ecs-deploy-cli/issues/
      slackCommitPrefix: https://github.com/poviolabs/ecs-deploy-cli/commit/
      slackProjectName: ECS-Deploy
```

```bash
yarn ecs-deploy-cli slack --messageType success
yarn ecs-deploy-cli slack --messageType failure
yarn ecs-deploy-cli slack --messageType info --message A custom message!
```

### --message

Any text appended to the Slack message

```
yarn ecs-deploy-cli slack --messageType success --message A custom message!
```

### --messageType

- `success`
- `failure`
- `info`

### --release

Release of the build (ie the git sha) and is unique per code.

### --appVersion

Version of the deploy. Tied to a specific Release and Stage.
If supplied with a semver format, the version will be prefixed with `${STAGE}`

### --releaseStrategy

- gitsha - make the same build for all stages
- gitsha-stage - make a build based on the stage and git sha in cases where the build is different per stage


## Development

### Test CLI locally

Set up `./test/secrets.env` with credentials to do a E2E test.

```bash
# test with ts-node
yarn test:ts-node:cli --help

# build new version
yarn build

# test build
yarn test:cli --help
```
