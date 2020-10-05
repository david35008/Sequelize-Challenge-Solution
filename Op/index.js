const Op = {
  ">": (object) => {
    const gt = Object.keys(object).reduce((prev, next, index) => {
      if (index === Object.keys(object).length - 1) {
        return (prev += `${next} > ${object[next]}`);
      } else {
        return (prev += `${next} > ${object[next]} AND `);
      }
    }, "");
    return gt;
  },
  "<": (object) => {
    const lt = Object.keys(object).reduce((prev, next, index) => {
      if (index === Object.keys(object).length - 1) {
        return (prev += `${next} < ${object[next]}`);
      } else {
        return (prev += `${next} < ${object[next]} AND `);
      }
    }, "");

    return lt;
  }
};

module.exports = { Op };
