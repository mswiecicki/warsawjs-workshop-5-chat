module.exports = {

    production: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: './chat_users.db'
        },
        migrations: {
            directory: './migrations'
        }
    }

};
