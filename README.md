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

#### --pwd

Root from where to fetch `config.yaml` and the base for all relative paths.

#### --stage

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

## Command `node-stage env`

#### node-stage env var \[path-to-variable\]

Fetches the variable at the specified path and returns it.

Example:
```
node-stage env var moduleName.variableKey
```

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
