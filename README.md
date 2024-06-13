Step 0: Create the .env File

Create a new file named .env in the root directory of your project and add the following content:

    PORT=5000
    PGUSER=postgres
    PGHOST=localhost
    PGDATABASE=assessment
    PGPASSWORD=password
    PGPORT=5432

Replace the values with your actual database and server configurations.
Step 1: Install Dependencies

Install node modules:

    npm install

Step 2: Configure Knex.js

Create a knexfile.js in the root of your project and configure Knex.js to use your PostgreSQL database:

    module.exports = {
      development: {
        client: 'pg',
        connection: {
          host: process.env.PGHOST,
          user: process.env.PGUSER,
          password: process.env.PGPASSWORD,
          database: process.env.PGDATABASE,
        },
        migrations: {
          tableName: 'knex_migrations',
          directory: './migrations',
        },
      },
    };

Step 3: Create a Migration

Generate a new migration file to define the users table:

    npx knex migrate:make create_users_table

Open the newly created migration file in the migrations directory and define the up and down functions to create and drop the users table:

    exports.up = function (knex) {
      return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('name');
        table.string('email');
      });
    };
    
    exports.down = function (knex) {
      return knex.schema.dropTable('users');
    };

Step 4: Run the Migration

Run the migration to apply the changes to your database:

    npx knex migrate:latest

Step 5: Run the Backend Server

You can now run your backend server and it should be able to access the users table in your PostgreSQL database.

Make sure to add the .env file to your .gitignore file to prevent it from being committed to version control.
