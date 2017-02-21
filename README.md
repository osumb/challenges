# OSUMB Challenges
[![Build Status](https://travis-ci.org/osumb/challenges.svg?branch=master)](https://travis-ci.org/osumb/challenges)
[![Coverage Status](https://coveralls.io/repos/github/osumb/challenges/badge.svg?branch=master)](https://coveralls.io/github/osumb/challenges?branch=master)

Application for members of the OSUMB to signup for challenges

## Installation and setup

**NOTE: THIS IS ALL A LIE! THESE INSTRUCTIONS ARE OUT OF DATE. THIS WARNING WILL BE REMOVED ONCE THEY'RE NOT**

First [download and install Homebrew](http://brew.sh/)

Inside your terminal, run the following commands to get the project up and running.

```bash
git clone https://github.com/osumb/challenges.git
cd challenges
```

Install [Node](https://nodejs.org/en/) through any means you see fit.

__Make sure you're above v6 or the code won't run__

Then run:
```
script/setup
```

That's it! All your dependencies are ready to go

## Start the app
`./script` has some scripts for setup/testing/etc. While it may be tempting to run those as stand-alone scripts, use
npm commands to access any of the scripts you may want to run. All modules used for dev/server are installed in the `challenges` directory. [Required reading](https://nodejs.org/en/blog/npm/npm-1-0-global-vs-local-installation/). The goal is to be minimally intrusive on your local dev machine since there's no virtual machine setup or anything like that.

That being said, run the dev server:
```bash
npm run dev
```
If you want webpack to watch your public js/scss, run:
```bash
webpack --watch
```

Open [http://localhost:3000](http://localhost:3000) and enjoy!

### Tests
```bash
npm test
```
## Heroku
The server lives on Heroku. [@atareshawty](https://github.com/atareshawty) has the logins. Ask him if you want the ability to deploy or have access to
the Heroku git remotes

## Staging vs Production
### Staging
The staging instance is used to test new features, specifically ones that have made it into PRs. There is no staging
branch anymore. I've just been doing a deploy to staging from the branch I want to test. The staging url is still
[the same](https://osumbchallengesdev.herokuapp.com)

### Production
When code gets merged into master, it triggers a deploy to [prod](https://osumbchallenges.herokuapp.com). The master
branch is protected from force pushes and PR's must pass CI in order to get merged. **AGAIN... merges into master get
AUTOMATICALLY DEPLOYED TO PROD** so be careful when merging to master!
