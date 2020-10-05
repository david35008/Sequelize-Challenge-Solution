const { Op } = require("../Op/index");

function where(conditions) {
  const conditiosKeys = Object.keys(conditions);
  const properties = Object.getOwnPropertySymbols(conditions);
  let statement = conditiosKeys.reduce((prev, next, index) => {
    if (index === conditiosKeys.length - 1 && properties.length === 0) {
      return (prev += `${next} = '${conditions[next]}'`);
    } else {
      return (prev += `${next} = '${conditions[next]}' AND `);
    }
  }, "");

  if (properties.length > 0) {
    statement = properties.reduce((prev, next, index) => {
      if (index === properties.length - 1) {
        return (prev += `${Op[next.toString().slice(7, -1)](conditions[next])}`);
      } else {
        return (prev += `${Op[next.toString().slice(7, -1)](conditions[next])} AND `);
      }
    }, statement);
  }

  return "WHERE " + statement;
}

module.exports = { where }
