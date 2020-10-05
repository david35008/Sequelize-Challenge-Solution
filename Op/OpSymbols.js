const Op = {
    gt: Symbol.for('>'),
    lt: Symbol.for('<'),
    or: Symbol.for('OR'),
    and: Symbol.for('AND'),
    like: Symbol.for('LIKE')
}
module.exports = { Op }