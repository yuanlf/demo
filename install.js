var which = require('which')
var runCmd = require('./runCmd')
var { info, error, success } = require('./utils')

function findNpm() {
  var npms = ['tnpm', 'cnpm', 'npm'];
  for (var i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      return npms[i];
    } catch (e) {}
  }
  throw new Error('please install npm');
}

module.exports = function(done) {
  const npm = findNpm();
  info(`开始安装依赖，使用${npm}命令`)
  runCmd(which.sync(npm), ['install'], function() {
    done();
    info('依赖安装完成')
  });
}
