import mysql from "mysql";
import knex from "knex";
import { configLocal, configSql, configSqlite } from "../options/config.js" 

const databaseMySQL = knex(configSql);
const databaseSqlite = knex(configSqlite);

const createDB = async (req, res, next) => {
    const connectionToDB = await mysql.createConnection(configLocal);
    connectionToDB.connect((err) => {
        if(err) throw new Error("Error al conectarse con la base de datos.")
        connectionToDB.query("CREATE DATABASE IF NOT EXISTS database_mariadb", (err) => {
            if(err) throw new Error("Error al conectarse a la base de datos.")
            console.log("Conectado a la base de datos.")
        })
    }) 
    next();
}

const createTableSQL = async (req, res, next) => {
    try {
        databaseMySQL.initialize(databaseMySQL);
        const tableCreated = await databaseMySQL.schema.hasTable("products");
        if(tableCreated) {
            next()
        } else {
            await databaseMySQL.schema.createTable("products", (table) => {
                table.increments("id");
                table.string("name");
                table.integer("price");
                table.string("image");
            })
                .finally(() => databaseMySQL.destroy());
            console.log("Tabla products creada.")
            next();
        }
    } catch (error) {
        console.log(error)
    }
}

const createSqlite = async (req, res, next) => {
    try {
        const created = await databaseSqlite.schema.hasTable("messages");
        if(created) {
            next()
        } else {
            await databaseSqlite.schema.createTable("messages", (table) => {
                table.increments("id");
                table.string("email");
                table.string("date");
                table.string("message")
            })
            console.log("Tabla de messages creada");
            next();
        }
    } catch (error) {
        console.log(error)
    }
}

export {
    createDB,
    createTableSQL,
    createSqlite
}