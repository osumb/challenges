# OSUMB Challenges
[![Build Status](https://travis-ci.org/osumb/challenges.svg?branch=master)](https://travis-ci.org/osumb/challenges)
[![Coverage Status](https://coveralls.io/repos/github/osumb/challenges/badge.svg?branch=master)](https://coveralls.io/github/osumb/challenges?branch=master)

Manage the challenge process for the Ohio State University Marching Band

## Installation and setup

This app has a few dependencies you need to install yourself. The use of each will be explained below

- [Docker](https://docs.docker.com/engine/installation/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Rails](https://github.com/rails/rails)
- [Node](https://github.com/nodejs/node)
- [Yarn](https://yarnpkg.com/en/)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)


#### Docker/Docker Compose

We're using Docker to run our datastores (PostgreSQL and Redis). The benefit of using Docker
is that it eliminates the need to install the data stores and have them running/cluttering up your
computer.

#### Rails

Rails is a popular web server framework. It's used to handle web requests

#### Node

Node allows us to run JavaScript through the command line. It's used to install dependencies and
build our front end app.

#### Yarn

Yarn is out node package manager. It's super fast at installing dependencies

#### Heroku CLI

The app is running on Heroku! Their cli comes in handy if/when you need to use the service.
It's also leveraged for local development (see `bin/server`)

### Get the Code
Inside your terminal, run the following commands to get the code.

```bash
git clone https://github.com/osumb/challenges.git
cd challenges
```

### Install Rails Dependencies

```bash
bundle install
```

### Install JavaScript Dependencies

```bash
(cd client && yarn install)
```

### Datastores

Every web app needs a database! You can run one locally with `docker-compose up -d`

### Environment variables
Rails will yell at you if you don't have a `.env` file available, so add one!
The required keys are listed in `config/envvars.yml`. The format of your `.env` file should be:

```
ENVIRONMENT_VARIABLE_KEY=environment_variable_value
```

## Start the app
You should be good to go with dependencies and everything. To start app locally, just run
```bash
bin/server
```

This command will start the rails server and a webpack server.

The rails server handles web requests. The webpack server serve static files to run in the browser


The rails server will run at [localhost:3001](http://localhost:3001)

The webpack dev server (where you want to go to use the app) will run at [localhost:5000](http://localhost:5000)

The webpack server gives us all cool kinds of things thanks to [Create React App](https://github.com/facebookincubator/create-react-app). We get hot reloading, and if you look at `client/src/index.jsx`, you'll see that we have hot *module* reloading :tada:. In development only, the webpack server proxies all requests made from `localhost:5000` to the Rails server at `:3001`. The means, we had to turn on CORS in dev only (see `config/initializers/cors.rb`).

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

```bash
bin/test
```

### Code Formatting

#### Ruby

Checkout .rubocop.yml to see the ruby specific code formatting rules

#### JS

JavaScript is formatted with a combination of [Prettier](https://github.com/prettier) and [Eslint](https://github.com/eslint)


Linting for both languages are part of tests therefore they're a part of CI. Poorly formatted code will break the build
Before committing js code, run the script `bin/js_format`. This will run prettier on all files to make sure everything looks pretty :sparkles:


## Heroku
The app lives on Heroku. [@atareshawty](https://github.com/atareshawty) has the logins. Ask him if you want the ability to deploy or have access to
the Heroku git remotes.

For the interested, this app needs two `package.json` files. The one located at `./package.json` is for Heroku to notice that this app does indeed require Node. The one in `client/package.json` is where all the information for our React app lives. The outer file has instructions for client side code building that Heroku needs for a deploy.

## Deploying

To deploy to either environment, simply run `bin/deploy <app>`, where `<app>` is either `osumbchallenges` or `osumbchallengesdev`.
*Note: The app names need to match the heroku git remotes, or this script will break*

You can optionally deploy a branch to staging or production (staging for testing, production for emergencies).
Example: If I wanted to deploy my branch `alex-cool-new-feature` to staging for testing, I'd run:

```bash
bin/deploy osumbchallengesdev alex-cool-new-feature
```

## Staging vs Production
### Staging
The staging instance is used to test new features, specifically ones that have made it into PRs.
There is no staging branch.
To test, just do a manual deploy to the staging instance.

### Production
The master branch is protected from force pushes and PR's must pass [CI](https://travis-ci.org/) in order to get merged.
