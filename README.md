# DonateMatcher

## Structure

- React based frontend is in the _client_ directory
- GraphQL based API backend is in the _server_ directory

## Setup

### Clone Repo

```sh
git@github.com:vkapur2202/campus-carpooling.git
```

## Client Development

All commands will assume you're in `campus-carpooling/client`.

### Install Dependencies

Every time you want to run the client, just in case new dependencies have been added, run:

```sh
$ npm install
```

### Start Client

```sh
$ npm start
```

## Backend Development

All commands will assume you're in `campus-carpooling/server`.

### Install Dependencies

Every time you want to run the server, just in case new dependencies have been added, run:

```sh
$ npm install
```

When you clone the repo for the first time and run `npm install` you also need to run:

```sh
$ npm run refresh-schema
```

### Seed DB

If you want to add or delete initial test data, modify `/src/seed.ts`. To reset the db (delete all data and re-seed), run:

```sh
$ npm run reset-db
```

### Start Server

```sh
$ npm start
```

You should see: _`Server is running on http://localhost:4000 🚀`_

### Make Change to DB

If you ever need to make a change to the dev db schema (adding or deleting tables/changing column names/adding or deleting foreign keys/etc), modify `database/init_db.sql`. To actually commit the change to the db, run:

```sh
$ psql --host=campus-carpoolingdb.cb7isu5t5kyq.us-east-2.rds.amazonaws.com --port=5432 --username=postgres --password --dbname=carpoolingDB < database/init_db.sql
$ npm run refresh-schema
```
You will be prompted for a password. This should be the password for the database access. the command

```sh
$ npm run refresh-schema
```
will also run
```sh
$ npx prisma generate
```
and therefore it is not necessary to generate the prisma client again.
### Regenerate Prisma Client

The Prisma Client creates all the GraphQL types for our backend so it's important that it's up-to-date with the `database/schema.prisma` file. If you ever make a change in `/database` make sure to run:

```sh
$ npx prisma generate
```

### Start Prisma Studio

To see a frontend for the db schema in your browser, run:

```sh
$ npm run studio
```
