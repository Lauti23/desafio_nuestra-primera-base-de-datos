import knex from "knex";

export class Manager {
    constructor(config, table) {
        this.db = knex(config);
        this.table = table;
    }

    async insert(obj) {
        try {
            let id = await this.db(this.table).insert(obj);
            return id;
        } catch (error) {
            console.log(error)
        }
    }

    async getById(row) {
        try {
            let data = await this.db(this.table).whereRaw("id = ?", row);
            return JSON.parse(JSON.stringify(...data))
        } catch (error) {
            console.log(error)
        }
    }

    async getAll() {
        try {
            let data = await this.db.from(this.table).select("*");
            return JSON.parse(JSON.stringify(data));
        } catch (error) {
            console.log(error)
        }
    }

    async updateById(obj) {
        try {
            let data = await this.db(this.table)
                .where({id: obj.id})
                .update({name: obj.name, price: obj.price, image: obj.image});
            return data
        } catch (error) {
            console.log(error)
        }
    }

    async deleteById(id) {
        try {
            let data = await this.db(this.table).where({id: id}).del();
            return data;
        } catch (error) {
            console.log(error)
        }
    }
}