'use strict'

var async = require('async')
var Metalsmith = require('metalsmith')
var inquirer = require('inquirer')
var render = require('consolidate')
  .handlebars.render
var spawn = require('cross-spawn')

var { info, error, success } = require('./utils')

function generateLab(params, fn) {
  var metalsmith = Metalsmith(__dirname)
    .metadata({
      title: "wind",
      description: "wind",
    })
    .source('./template/lab')
    .destination('./lab')
    .clean(false)
    .use(labTemplate)
    .build(function(err) {
      if (err) throw err;
    })

  /**
   * Template in place plugin.
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */
  function labTemplate(files, metalsmith, done) {
    var keys = Object.keys(files)
    var metadata = metalsmith.metadata()

    // 合并外部参数
    Object.assign(metadata, params);

    info('开始生成组件的实验室环境')

    async.each(keys, run, function() {
      info('组件的实验室环境生成成功')
      done();

      if (fn) fn();
    })

    function run(file, done) {
      var str = files[file].contents.toString()
      render(str, metadata, function(err, res) {
        if (err) return done(err)

        files[file].contents = new Buffer(res)

        success(`✔ create ${file} successfully!`)

        done()
      });
    }
  }
}

module.exports = generateLab
