const clauses = require('./clauses')

class MySequelize {
    constructor(connect, tableName) {
        this.connection = connect;
        this.table = tableName;
    }

    async create(obj) {

        const result = await this.connection.query(
            `INSERT INTO ${this.table} set ?`, obj
        );

        return result[0]
    }

    async bulkCreate(arr) {

        let result = []
        for (const iterator of arr) {
            result.push(await this.connection.query(
                `INSERT INTO ${this.table} set ?`, iterator
            ))
        }
        return result
    }

    async findAll(options) {
        const results = await this.connection.query(
        `SELECT ${(options && options.attributes) ? clauses.attributes(options.attributes) : '*'} 
        FROM ${this.table} 
        ${handleOptions(options)}`)

        if (options && options.include) {
            return await clauses.include(results[0], options.include, this.connection)
        } else {
            return results[0]
        }
    }

    async findByPk(id) {
        const result = await this.connection.query(
            `SELECT * FROM ${this.table} WHERE id= ${id}`
        );
        return result[0]
    }

    async findOne(options) {
        const results = await this.connection.query(`SELECT 
        ${(options && options.attributes) ? clauses.attributes(options.attributes) : '*'} 
        FROM ${this.table}
        ${handleOptions(options)}
        LIMIT 1`)
        return results[0]
    }

    async update(newDetsils, options) {
        return await this.connection.query(
            `UPDATE ${this.table} 
          ${set(newDetsils)}
          ${handleOptions(options)}`)
    }

    async destroy({ force, ...options }) {
        force ? this.connection.query(
            `DELETE FROM ${this.table} ${handleOptions(options)}`)
            : await this.connection.query(`UPDATE users 
            SET deleted_at=${`\"${new Date().toISOString().slice(0, 19).replace('T', ' ')}\"`} 
            ${handleOptions(options)}`);
    }

    async restore(options) {
        return await this.connection.query(
            `UPDATE ${this.table} 
            SET deleted_at = null 
            ${handleOptions(options)}`);
    }
}

module.exports = { MySequelize };

function set(fields) {
    const allKeys = Object.keys(fields);
    return 'set ' + allKeys.reduce((prev, next, index) => {
        if (index === allKeys.length - 1) {
            return prev += `${next} = '${fields[next]}'`
        } else {
            return prev += `${next} = '${fields[next]}', `
        }
    }, '')
}

function handleOptions(options) {
    let optionsStatment = options ? Object.keys(options).reduce((prev, next) => {
        if (next === 'include') {
            return prev
        }
        prev[next] = clauses[next](options[next])
        return prev
    }, {})
        : ''

    return `${optionsStatment.where ? optionsStatment.where : ''} 
        ${optionsStatment.order ? optionsStatment.order : ''} 
        ${optionsStatment.limit ? optionsStatment.limit : ''}`
}