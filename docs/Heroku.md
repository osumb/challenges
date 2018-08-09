# Setting Up Heroku

Access to the Heroku account is required to deploy to either the production or staging app.

## Installing the cli

```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

## Log In

Get the Heroku account credentials, then run

```bash
heroku auth:login
```

You'll be prompted for email and password

## Setting up the git remotes

Deploying to Heroku requires pushing to a git remote repository. A git remote needs to be setup for each app (staging and production).

Setup staging:

```bash
git remote add staging https://git.heroku.com/osumbchallengesdev.git
```

Setup production:

```bash
git remote add production https://git.heroku.com/osumbchallenges.git
```

## Some useful command

Run a bash shell in a web dyno:

`heroku run bash --remote staging/prod`

Tail application logs:

`heroku logs --tail --remote stagins/prod`
