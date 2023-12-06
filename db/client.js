const { Pool } = require("pg");

const connectionString =
  "https://localhost:5432/twitterclone" || process.env.DATABASE_URL;

const client = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = client;
