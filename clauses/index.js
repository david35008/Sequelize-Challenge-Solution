const { where } = require('./where');
const { include } = require('./include')

function order(conditions) {
    return `ORDER BY ${conditions[0]} ${conditions[1] ? conditions[1] : ''}`
}

function limit(number) {
    return `LIMIT ${number}`
}

function attributes(columns) {
    return columns.reduce((prev, next, index) => {
        let attribute = Array.isArray(next) ?
            next[0] + ' AS ' + next[1] : next;

        (index < columns.length - 1) && (attribute += ', ')

        return prev += attribute

    }, '')
}


module.exports = { where, order, limit, attributes, include }