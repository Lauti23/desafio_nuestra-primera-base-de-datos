const configLocal = {
    host: "127.0.0.1",
    user: "root",
    password: ""
}

const configSql = {
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "database_mariadb"
    },
    pool: {min: 0, max: 7}
}

const configSqlite = {
    client: "sqlite3",
    connection: {
        filename: "./src/db/ecommerce.sqlite"
    },
    useNullAsDefault: true
}

export {
    configLocal,
    configSql,
    configSqlite
}