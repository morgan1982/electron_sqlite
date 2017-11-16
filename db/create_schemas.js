const { knex } = require('./knex_connect');

function createTable () {
    
        console.log('started creation..')
        let tbl = 'keychain'
        knex.schema.createTableIfNotExists( tbl, (table) => {
            table.increments(),
            table.string('name'),
            table.string('web'),
            table.string('user'),
            table.string('password'),
            table.string('email'),
            table.timestamps()
    
    
        }).then( () => {
            console.log("success");
        })
    }

    module.exports = {
        createTable
    }