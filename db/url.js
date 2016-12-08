module.exports =
  process.env.DATABASE_URL ||
  (`postgres://${process.env.TRAVIS_DB_NAME
    ? `${process.env.TRAVIS_DB_NAME}@`
    : ''}localhost:5432/challenges_dev`
  );
