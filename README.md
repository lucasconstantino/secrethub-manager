# SecretHub Manager

CLI tool for managing a single project's secrets targeting possibly multiple environments.

## Why?

Secret management is often a mess. [Vault by HashiCorp](https://www.vaultproject.io/) and others solve this brilliantly, but with the clear downside of complexity. [SecretHub](https://secrethub.io/) is a promising alternative for it's simplicity, but it still requires developers learn how to use it properly.

SecretHub Manager CLI is built on top of SecretHub to create an environment variable system that's easy to config, use, manage, and expand during the progress of a project.

## Installation

```
yarn add secrethub-manager
```

## Usage

### Credentials

There is a couple of ways to provide SecretHub Manager with credentials to connect to SecretHub API, here on listed in the order of priority:

#### A) Environment variable

SecretHub CLI respects an environment variable `SECRETHUB_CREDENTIAL` with a credential string - so does SecretHub Manager.

**When:** perfect for usage on CIs 

#### B) Global secrethub sign-up

If you already use [SecretHub CLI](https://github.com/secrethub/secrethub-cli) and would like to use the globally signed-up user credentials, you don't need extra configuration.

**When:** simple, single person projects, or when you have all team members signed-up to the same SecretHub organization.

#### C) Local `.secrethub/credential` file

You can save the project's SecretHub credential on a file at `.secrethub/credential`.

**When:** perfect for sharing a single credential with a small team.

> Don't forget to add `.secrethub` dir to `.gitignore`!

#### D) Prompted if missing

Any command will request you to manually input the credential if you haven't setup one of the previous methods.

### Template

Create a `secrethub.env` file following [SecretHub template](https://secrethub.io/docs/reference/cli/template-syntax/) guide. This will be your source of truth for any environment.

#### Template variables

SecretHub Manager supports SecretHub's [template variables](https://secrethub.io/docs/reference/cli/template-syntax/#variables) via the `SECRETHUB_VAR_<var_name>` environment variable pattern.

Also, you can define your variables on `package.json`, so that SecretHub Manager can prompt for them when they are missing - useful to simplify switching envs locally. Ex:

```diff
+  },
+  "secrethub": {
+    "variables": {
+      "env": {
+        "message": "What environment you want to initialize?",
+        "choices": [
+          "development",
+          "qa",
+          "staging",
+          "production"
+        ]
+      }
+    }
   }
 }
```

### Usage

#### Initialize

```sh
yarn secrethub-manager init
```

Will inject secrethub variables into the `secrethub.env` file, and save it as `.env`.

#### Save

```sh
yarn secrethub-manager save
```

Will save the current `.env` file to SecretHub, based on the `secrethub.env` template.

#### Manager

SecretHub Manager provides two commands to facilitate managing all available variables, for all targeted environments of your project, in your local machine:

##### Download

```sh
yarn secrethub-manager manager download
```

Will get all available SecretHub secrets, and add to a single file: `.secrethub/manager`.

You can limit to a sub-path on SecretHub by configuring your `package.json` as follows:

```diff
 }
+  },
+  "secrethub": {
+    "path": "some/path"
   }
 }
```

> Don't forget to add `.secrethub` dir to `.gitignore`!

##### Save

After manually altering `.secrethub/manager` content, use this command to save it all back to SecretHub:

```sh
yarn secrethub-manager manager save
```