const clauses = require('../clauses')

async function include(firstRes, tables, connection) {
    return await tables.reduce((prev, next) => {
        return prev = join(firstRes, next, connection)
    }, firstRes);
}

async function join(firstRes, { table, sourceForeignKey, tableForeignKey, ...options }, connection) {
    let optionsStatment = {}
    if (options) {
        const conditions = Object.keys(options)
        optionsStatment = conditions.reduce((statment, condition) => {
            statment[condition] = clauses[condition](options[condition])
            return statment
        }, {})
    }
    const results = await connection.query(
        `SELECT ${optionsStatment.attributes ? optionsStatment.attributes : '*'} 
    FROM ${table} 
    ${optionsStatment.where ? optionsStatment.where : ''} 
    ${optionsStatment.order ? optionsStatment.order : ''} 
    ${optionsStatment.limit ? optionsStatment.limit : ''}`)

    firstRes = firstRes.map(res => {
        results[0].forEach(joinRow => {
            if (res[sourceForeignKey] === joinRow[tableForeignKey]) {
                if (!res[table]) {
                    res[table] = []
                }
                res[table].push(joinRow);
            }
        });
        return res;
    })
    if (options && options.include) {
        return await include(firstRes, options.include, connection)
    } else {
        return firstRes
    }
}

module.exports = { include }
