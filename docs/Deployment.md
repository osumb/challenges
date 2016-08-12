# Deploying Osumb Challenges

When you merge a PR to the master branch it will trigger a build for the [production app](osumbchallenges.herokuapp.com)

Easy Right? Heroku is cool like that.

## Some Useful Heroku Commands to Remember
__This assumes you have your Heroku remotes (yes, there are two) set up and are logged in with OSUMB Heroku account__

Want to ssh into either staging or prod? (please don't unless you absolutely have to)

```heroku run bash --remote staging/prod```

How about we tail some logs? (please do, they're really helpful)

```heroku logs --tail --remote stagins/prod```

If you want to recreate the mock data on staging? __Staging only!!__

```heroku run node models/setup.js --remote staging```
