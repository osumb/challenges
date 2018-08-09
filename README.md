# OSUMB Challenges

Manage the challenge process for the Ohio State University Marching Band

## Installation and setup

This app has a few dependencies you need to install yourself. The use of each will be explained below

- [Docker](https://docs.docker.com/engine/installation/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Rails](https://github.com/rails/rails)
- [Postgres](https://www.postgresql.org/docs/current/static/tutorial-install.html) <-- This is just for the ability to install the pg gem
- [Node](https://github.com/nodejs/node)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

#### Docker/Docker Compose

We're using Docker to run our datastores (PostgreSQL and Redis). The benefit of using Docker
is that it eliminates the need to install the data stores and have them running/cluttering up your
computer.

#### Rails

Rails is a popular web server framework. It's used to handle web requests

#### Heroku CLI

The app is running on Heroku! Their cli comes in handy if/when you need to use the service.
It's also leveraged for local development (see `bin/server`).
See [Heroku.md](docs/Heroku.md) for more details.

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

This command will start a rails web server and a [Resque](https://github.com/resque/resque) worker for asynchronous jobs

The rails server will run at [localhost:3000](http://localhost:3000)

## Application Stack

### Rails

The API layer is a [Ruby on Rails App](http://rubyonrails.org/)

### Tests

Tests are cool and you should run them a lot!

```bash
bundle exec rspec .
```

### Code Formatting

#### Ruby

Checkout .rubocop.yml to see the ruby specific code formatting rules

## Heroku

The app lives on Heroku. [@atareshawty](https://github.com/atareshawty) has the logins. Ask him if you want the ability to deploy or have access to
the Heroku git remotes.

## Deploying

To deploy to either environment, simply run `bin/deploy <remote>`, where `<remote>` is either `production` or `staging`.

You can optionally deploy a branch to staging or production (staging for testing, production for emergencies).
Example: If I wanted to deploy my branch `alex-cool-new-feature` to staging for testing, I'd run:

```bash
bin/deploy <staging|production> cool-new-feature
```

## Staging vs Production

### Staging

The staging instance is used to test new features, specifically ones that have made it into PRs.
There is no staging branch.
To test, just do a manual deploy to the staging instance.

### Production

The master branch is protected from force pushes and PR's must pass
