121 platform
============

121 is an open source platform for Cash based Aid built with Digital Identity & Local/Global Financial service partners.  -- Learn more about the platform: <https://www.121.global/>

---

## Status

| Interfaces       | Build Status                                                                                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PA-App           | [![Build Status](https://dev.azure.com/redcrossnl/121%20Platform/_apis/build/status/Interfaces/PA-App?branchName=master)](https://dev.azure.com/redcrossnl/121%20Platform/_build/latest?definitionId=17&branchName=master)                |
| PA-App (Android) | [![Build Status](https://dev.azure.com/redcrossnl/121%20Platform/_apis/build/status/Interfaces/PA-App%20--%20Android?branchName=master)](https://dev.azure.com/redcrossnl/121%20Platform/_build/latest?definitionId=23&branchName=master) |
| AW-App           | [![Build Status](https://dev.azure.com/redcrossnl/121%20Platform/_apis/build/status/Interfaces/AW-App?branchName=master)](https://dev.azure.com/redcrossnl/121%20Platform/_build/latest?definitionId=18&branchName=master)                |
| HO-Portal        | [![Build Status](https://dev.azure.com/redcrossnl/121%20Platform/_apis/build/status/Interfaces/HO-Portal?branchName=master)](https://dev.azure.com/redcrossnl/121%20Platform/_build/latest?definitionId=13&branchName=master)             |
| Referral-App        | [![Build Status](https://dev.azure.com/redcrossnl/121%20Platform/_apis/build/status/Interfaces/Referral-App?branchName=master)](https://dev.azure.com/redcrossnl/121%20Platform/_build/latest?definitionId=24&branchName=master)             |

| Services            | Build Status                                                                                                                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 121-service         | [![Build Status](https://dev.azure.com/redcrossnl/121%20Platform/_apis/build/status/Services/121-service?branchName=master)](https://dev.azure.com/redcrossnl/121%20Platform/_build/latest?definitionId=12&branchName=master)           |
| PA-accounts-service | [![Build Status](https://dev.azure.com/redcrossnl/121%20Platform/_apis/build/status/Services/PA-accounts-service?branchName=master)](https://dev.azure.com/redcrossnl/121%20Platform/_build/latest?definitionId=19&branchName=master)   |
| Tykn-SSI-Services   | [![Build Status](https://dev.azure.com/redcrossnl/121%20Platform/_apis/build/status/Services/Tykn%20SSI%20Services?branchName=master)](https://dev.azure.com/redcrossnl/121%20Platform/_build/latest?definitionId=20&branchName=master) |

## Documentation
The documentation of the 121 platform can be found on the Wiki of this repository on GitHub.


## Getting Started
To set up a local development-environment:

### On Windows

#### Install dependencies
- Install Node.js (<https://nodejs.org/en/download/>)  
  To prevent conflicts between projects or components using other versions of Node.js it is recommended to use a 'Node version manager'.  
  Make sure to install the version specified in the [`.node-version`](.node-version)-file
- Install Git (<https://git-scm.com/download/win>)
- Install Docker (<https://docs.docker.com/docker-for-windows/install/>)

### On Linux

#### Install dependencies
- Install Node.js  
  To install the required version of Node.js and to prevent conflicts between projects or components using other versions of Node.js, use [NVM - Node Version Manager](http://nvm.sh/).  
  After installing NVM run:

      nvm install && nvm install-latest-npm

- Install Git

      sudo apt install git-all

- Install Docker  
  On linux distributions we need to install `docker engine` and `docker-compose` respectively. On other platforms they are available through Docker Desktop. Read more at: <https://docs.docker.com/engine/install/>

  `Docker compose` relies on `docker engine`, so in order to get started we must install `docker-engine` first. (Read more at: <https://docs.docker.com/engine/install/ubuntu/>). There are various ways of installing `docker engine` (repository, packages or automated scripts). The official recommended way doing that is through setting up a repository.

  - First off, uninstall any old version of docker-engine.

        sudo apt-get remove docker docker-engine docker.io containerd runc

  - Choose an installation method from the provided list at <https://docs.docker.com/engine/install/ubuntu/#installation-methods> and install `docker-engine`
  - Test your docker installation

        sudo docker run hello-world

  - Now install docker-compose  
    Can be done by following the steps at: <https://docs.docker.com/compose/install/>

        sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose

  - Test the docker compose installation

        docker-compose --version

  - Additionally, we need to install `docker-machine` as well, see: <https://docs.docker.com/machine/install-machine/>
  
        base=https://github.com/docker/machine/releases/download/v0.16.0 && curl -L $base/docker-machine-$(uname -s)-$(uname -m) >/tmp/docker-machine && sudo mv /tmp/docker-machine /usr/local/bin/docker-machine &&   chmod +x /usr/local/bin/docker-machine

  - You are set!

### On macOS

#### Install dependencies
- Install Node.js  
  To install the required version of Node.js and to prevent conflicts between projects or components using other versions of Node.js, use [NVM - Node Version Manager](http://nvm.sh/).  
  After installing NVM run:

      nvm install && nvm install-latest-npm

- Install Git  
  <https://git-scm.com/book/en/v2/Getting-Started-Installing-Git> > Installing on macOS (section)
- Install Docker (<https://docs.docker.com/docker-for-mac/install/>)  
  Install docker-machine, see: <https://docs.docker.com/machine/install-machine/>

        base=https://github.com/docker/machine/releases/download/v0.16.0 && curl -L $base/docker-machine-$(uname -s)-$(uname -m) >/usr/local/bin/docker-machine && chmod +x /usr/local/bin/docker-machine

  Once the dependencies are resolved depending on your OS, as above we can set-up the repositories and other environment variables

## Setup Repository
Download/Clone the Git repository.

    git clone https://github.com/global-121/121-platform.git


## Setup Interfaces
Install dependencies for the interfaces, from the root of this repository, run:

    npm run install:interfaces

Or to install 1 specific interface's dependencies, run: (where `<interface-name>` is one of `pa`, `aw`, `ho`, `referral`)

    npm run install:<interface-name>

## Setup Services

Follow the "[Getting started / installation](services/README.md#getting-started--installation)"-section in the [services/README](services/README.md)-file.

After that, you can start in development mode by running from the root folder:
- `npm run start:services`

To start either of the interfaces in development mode:
- Run `npm run start:<interface-name>`, where `<interface-name>` is one of `pa`, `aw`, `ho`, `referral`.
- Or explore the specific options(to run the native Android version, for example) as defined in each interface's own `package.json` or `README.md`.


## Testing
- Scenarios of end-to-end/integration-tests for the whole platform are described in [`/features`](features/#readme).
- Each component has its own individual tests:
  - Unit-tests and UI-tests for all interfaces; Run with `npm test` in each `interfaces/*`-folder.
  - Unit-tests and integration-tests for all services; Run with `npm test` in each `services/*`-folder.


## Releases
See notable changes and the currently release version in the [CHANGELOG](CHANGELOG.md).

### Release Checklist
This is how we create and publish a new release of the 121-platform.  
(See [the glossary](#glossary) for definitions of some terms.)

- [ ] Define the date/time of the release. (Notify the dev-team for a code-freeze.)
- [ ] Define what code gets released. ("_Is the current `master`-branch working?_")
- [ ] Define the `version`(-number) for the upcoming release.
- [ ] Update the [CHANGELOG](CHANGELOG.md) with the date + version.
  - [ ] Commit changes to `master`-branch on GitHub.
- [ ] Create a `release`-branch ("`release/<version>`") from current `master`-branch
  - [ ] Push this branch to GitHub
- [ ] Run the [Azure Pipelines](https://dev.azure.com/redcrossnl/121%20Platform/_build) for the native Android-apps on that `release`-branch
  - [ ] Download the generated artifacts (`PA-App.zip`)
  - [ ] Rename to match the version (i.e: `PA-App-v0.1.0.zip`)
- [ ] "[Draft a release](https://github.com/global-121/121-platform/releases/new)" on GitHub  
  - [ ] Add the `version` to create a new tag
  - [ ] Select the new `release/<version>`-branch
  - [ ] Set the title of the release to `version`
  - [ ] Add a short description and/or link to relevant other documents (if applicable)
  - [ ] Create/publish the release on GitHub

### Patch/Hotfix Checklist

This follows the same process as a regular release + deployment. With some small changes.
- Code does not need to be frozen. (As there is no active development on the release-branch)

#### Manual approach
- Checkout the `release/<version>`-branch that needs the hotfix.
- Create a new local branch (e.g. `release/<v0.x.1>`) and make the changes
- Push this branch directly to the main/upstream repository, not to a personal fork.
- Create a new release (see above) and publish it.  
  The publish-command will invoke the webhook(s), which trigger an automated deploy for environments on that same *minor* version.
- Add the hotfix-release to the [CHANGELOG](CHANGELOG.md)
- After the hotfix-release, apply the same fix to the master-branch in a regular PR (by creating a PR from the hotfix-branch to `master`-branch)

#### GitHub web-interface-only approach
- Browse to the specific file that needs a fix on GitHub, click "edit" and make the changes  
  The URL will look like: `https://github.com/global-121/121-platform/edit/release/v0.x.0/<path-to-file>`
- Select "Create a new branch for this commit and start a pull request" from the "commit changes"-box
- Use `release/v0.x.1` as the branch-name by clicking "Propose changes"  
  This branch will now be created and is available to use for a new release
- Add the hotfix-release to the [CHANGELOG](CHANGELOG.md) and commit to the same `release/v0.x.1` branch.
- Create a new release (see above) and publish it.  
  The publish-command will invoke the webhook(s), which trigger an automated deploy for environments on that same *minor* version.
- After the hotfix-release, apply the fixes to the master-branch by merging the PR created.


## Deployment

### To "test" environment
- Merged PR's to 'master' branch are automatically deployed to the test-server. (via [webhook](tools/webhook.service), see: [/tools#GitHub-webhook](tools/README.md#github-webhook))
  - To skip deployment after a PR is merged, add `[SKIP CD]` to the title of the PR before merging. (For example when only updating documentation)
- Make sure to update the environment-settings as soon as possible, preferably before the merge+deploy.

### To "production" environment

#### On initial deployment (only)
- [ ] Configure environment(s) as described in [/services > Getting started / Installation](services/README.md#getting-started-installation).
  - [ ] Checkout code (of latest release)
  - [ ] Set secrets, configure ENV-variables (via all `.env`-files)
  - [ ] Build the platform (by running the [deploy script](./tools/deploy.sh)):  
        Run: `sudo ./tools/deploy.sh`
- [ ] Setup the web-server as described in [/tools > Hosting > Apache2](tools/README.md#apache2)
- [ ] (Optional) Add data to the database using the available [seed-script](services/121-service/README.md#Seed-the-database)

#### On next deployments
- [ ] Decide on what version to deploy
- [ ] Check for any changes/additions/removals in the [CHANGELOG](CHANGELOG.md)
- [ ] Prepare the environment accordingly (in all `.env`-files)
  - [ ] Build the platform (by running the [deploy script](./tools/deploy.sh)):  
        Run: `sudo ./tools/deploy.sh <target-branch>`, where `<target-branch>` is for example: `release/v0.1.0`

## Glossary

| Term          | Definition (_we_ use)                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `version`     | A 'number' specified in the [`SemVer`](https://semver.org/spec/v2.0.0.html)-format: `0.1.0`                  |
| `tag`         | A specific commit or point-in-time on the git-timeline; named after a version, i.e. `v0.1.0`                 |
| `release`     | A fixed 'state of the code-base', [published on GitHub](https://github.com/global-121/121-platform/releases) |
| `deployment`  | An action performed to get (released) code running on an environment                                         |
| `environment` | A machine that can run code (with specified settings); i.e. a server or VM, or your local machine            |
