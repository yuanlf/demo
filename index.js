'use strict'

var chalk = require('chalk')
var async = require('async')
var rm = require('rimraf')
var Metalsmith = require('metalsmith')
var prompt = require('cli-prompt')
var inquirer = require('inquirer')
var render = require('consolidate')
  .handlebars.render;
var spawn = require('cross-spawn')

var metalsmith = Metalsmith(__dirname)
  .metadata({
    title: "aliyun console cli",
    description: "aliyun console cli.",
  })
  .source('./template/component')
  .destination('./build/components')
  .clean(false)
  .use(ask)
  .use(template)
  .build(function(err) {
    if (err) throw err;
  })

/**
 * Prompt plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function ask(files, metalsmith, done) {
  var metadata = metalsmith.metadata()

  var questions = require('./questions').questions

  inquirer.prompt(questions)
    .then(function(answers) {
      Object.assign(metadata, answers);

      done()
    });
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function template(files, metalsmith, done) {
  var keys = Object.keys(files)
  var metadata = metalsmith.metadata()

  // 调整组件生成目录
  metalsmith._destination = metalsmith._destination + '/' + metadata.componentName.toLowerCase()

  async.each(keys, run, done)

  function run(file, done) {
    var str = files[file].contents.toString()
    render(str, metadata, function(err, res) {
      if (err) return done(err)
      files[file].contents = new Buffer(res)

      console.log(chalk.green(`✔ create ${file} successfully!`))

      done();
    });
  }
}
