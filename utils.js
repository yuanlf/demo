var chalk = require('chalk')

function info(message) {
  console.log(chalk.cyan(message))
}

function error(message) {
  console.error(chalk.red(message));
}

function success(message) {
  console.error(chalk.green(message));
}

utils = {
  info,
  error,
  success
}

module.exports = utils