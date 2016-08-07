# OSUMB Challenges
[![Build Status](https://travis-ci.org/osumb/challenges.svg?branch=master)](https://travis-ci.org/osumb/challenges)

![alt text](./public/images/OSUMBlogo.jpg)

Application for members of the OSUMB to signup for challenges

## Installation and setup
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

Open [http://localhost:3000](http://localhost:3000) and enjoy!

### Tests
```bash
npm test
```
## Heroku
The server lives on Heroku. @atareshawty has the logins. Ask him if you want the ability to deploy or have access to
the Heroku git remotes

## Staging vs Production
### Staging
The staging branch is protected just like master. To test a feature, make a pull request to this branch. We have a
staging [Heroku instance](https://osumbchallengesdev.herokuapp.com). When a PR to staging is merged, it will a trigger a
build on that instance. Give it a minute after merging as it has to go through CI again.

### Production
Working on it... Waiting for approval to get a domain to get all of that figured out
