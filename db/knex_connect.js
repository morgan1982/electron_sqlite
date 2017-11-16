let knex = require('knex')({
    client: "sqlite3",
    connection: {
        filename: "./passcodes.sqlite"
    }
});

module.exports = {
    knex
}