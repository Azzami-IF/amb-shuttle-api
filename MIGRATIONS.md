Migrations
----------

To create the initial database schema for AMB Shuttle API, run the SQL file with your MySQL client:

```bash
mysql -u <user> -p <database> < migrations/001_initial_schema.sql
```

Replace `<user>` and `<database>` with your MySQL username and database name.

Notes:
- Use a managed database or local MySQL server.
- Ensure your `.env` contains correct `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
- For production, prefer a connection pool and secure credentials.
