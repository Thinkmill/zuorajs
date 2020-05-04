const util = require('util');

// Dump out
const catcher = error => {
  console.error('An error was encounted:')
  const dump = util.inspect({ ...error, body: error.response.body }, { showHidden: false, depth: null, colors: true });
  console.error(dump);
  throw error;
};

module.exports = { catcher };
