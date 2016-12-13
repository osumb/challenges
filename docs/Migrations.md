# Migrations

Believe me, what we have now is much better than what was going on earlier. Please read these [relevant docs](https://db-migrate.readthedocs.io/en/latest/)

## To create

```bash
$ cd db
$ ./../node_modules/.bin/db-migrate create [name] --sql-file
```

This will create three files: `[time-stamp]-name.js`, `[time-stamp]-name-up.sql`, and `[time-stamp]-name-down.sql`

These do exactly what you'd think. It uses the .js file to load/run the sql files

## To run

(From project root)

```bash
$ ./node_modules/.bin/db-migrate [command]
```
