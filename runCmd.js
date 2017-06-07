var spawn = require('cross-spawn')

function runCmd(cmd, args, fn) {
  args = args || [];
  var runner = spawn(cmd, args, {
      stdio: "inherit"
    });
  runner.on('close', function(code) {
    if (fn) {
      fn(code);
    }
  });
}

module.exports = runCmd