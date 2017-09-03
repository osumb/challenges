# OSUMB Challenges
[![Build Status](https://travis-ci.org/osumb/challenges.svg?branch=master)](https://travis-ci.org/osumb/challenges)
[![Coverage Status](https://coveralls.io/repos/github/osumb/challenges/badge.svg?branch=master)](https://coveralls.io/github/osumb/challenges?branch=master)

Manage the challenge process for the Ohio State University Marching Band

## Installation and setup

This app has 2 dependencies you need to install yourself.

- [Docker](https://docs.docker.com/engine/installation/)
- [Docker Compose](https://docs.docker.com/compose/install/)

We're using docker to make the dev environment platform agnostic i.e, we want this to easily be able to run on anything.
If you'd rather not keep everything in containers, download the code, setup your environment variables and head [here](https://github.com/osumb/challenges/tree/master#without-docker)

### Get the Code
Inside your terminal, run the following commands to get the code.

```bash
git clone https://github.com/osumb/challenges.git
cd challenges
```

### Environment variables
Rails will yell at you if you don't have a `.env` file available, so add one! You can find the available
variables in `.env.example`

### Setup
```bash
bin/setup
```

Now go get some :coffee: or something...

## Start the app
You should be good to go with dependencies and everything. To start app locally, just run
```bash
bin/server
```

This command will spin up two docker containers.

- Postgres 9.6.2 -- our database
- Web -- a webpack dev server serving our client side js bundles and the rails api server

The rails server will run at [localhost:3001](http://localhost:3001)

The webpack dev server (where you want to go to use the app) will run at [localhost:3000](http://localhost:3000)

The webpack server gives us all cool kinds of things thanks to [Create React App](https://github.com/facebookincubator/create-react-app). We get hot reloading, and if you look at `client/src/index.jsx`, you'll see that we have hot *module* reloading :tada:. In development only, the webpack server proxies all requests made from `localhost:3000` to the Rails server at `:3001`. The means, we had to turn on CORS in dev only (see `config/initializers/cors.rb`).


### Without Docker

It's not recommended, but you can set up your environment without docker.

Here's what you need:

- [Ruby](https://www.ruby-lang.org/en/) 2.4.0
- [Node JS](https://nodejs.org/en/) latest (above 6.0 *should* work)
- [PostgreSQL](https://www.postgresql.org/) 9.6.2
- [Heroku Cli](https://devcenter.heroku.com/articles/heroku-cli)
- [Yarn](https://yarnpkg.com/en/) *this is an optional alternative to running npm

Install those and run `bin/non_docker_setup`


To run the application server: `bin/heroku_local`. This will spin up the same setup as what's happening in the `web` container

** NOTE: ** most of scripts in `bin` can be run outside of the containers. Just omit the `docker-compose run web` part. If your setup is successful, the scripts will work


## Application Stack

### Rails
The API layer is a [Ruby on Rails App](http://rubyonrails.org/)

### React
All of the client side view/functionality is run as a [React App](https://facebook.github.io/react/).

## Client Production Build
Every once in a while, it's good to check whether the production bundle works as expected. To do this, run
`docker-compose run web client_build`. The 'React app will be built and put into `./public`. Then just start the rails server on any port you wish. It will serve the production client assets.

### Tests
Tests are cool. You should run them sometimes

With containers: `bin/local_test`
Without containers: `bin/ci_test`

Right now, we only have Rails tests. Once a set of tests are run, you'll be able to see our *Rails* code coverage in `coverage/index.html`. This directory is in the `.gitignore`, please don't commit this.

### Code Formatting

#### Ruby

Checkout .rubocop.yml to see the ruby specific code formatting rules

#### JS

JavaScript is formatted with a combination of [Prettier](https://github.com/prettier) and [Eslint](https://github.com/eslint)


Linting for both languages are part of tests therefore they're a part of CI. Poorly formatted code will break the build
Before committing js code, run the script `docker-compose run web bin/js_format`. This will run prettier on all files to make sure everything looks pretty :sparkles:


## Heroku
The app lives on Heroku. [@atareshawty](https://github.com/atareshawty) has the logins. Ask him if you want the ability to deploy or have access to
the Heroku git remotes.

For the interested, this app needs two `package.json` files. The one located at `./package.json` is for Heroku to notice that this app does indeed require Node. The one in `client/package.json` is where all the information for our React app lives. The outer file has instructions for client side code building that Heroku needs for a deploy.

## Staging vs Production
### Staging
The staging instance is used to test new features, specifically ones that have made it into PRs.
There is no staging branch.
To test, just do a manual deploy to the staging instance.
The staging url is still
[https://osumbchallengesdev.herokuapp.com](https://osumbchallengesdev.herokuapp.com)

### Production
When code gets merged into master, it triggers a deploy to [prod](https://osumbchallenges.herokuapp.com).
The master branch is protected from force pushes and PR's must pass [CI](https://travis-ci.org/) in order to get merged.
**AGAIN... merges into master get AUTOMATICALLY DEPLOYED TO PROD** so be careful when merging to master!
