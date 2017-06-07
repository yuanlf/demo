'use strict'

var rf = require("fs")
var async = require('async')
var rm = require('rimraf')
var Metalsmith = require('metalsmith')
var inquirer = require('inquirer')
var render = require('consolidate')
  .handlebars.render
var spawn = require('cross-spawn')

// wind配置文件
var wind = require('./wind')
var { info, error, success } = require('./utils')
var runCmd = require('./runCmd')

var metalsmith = Metalsmith(__dirname)
  .metadata({
    title: "wind",
    description: "wind",
  })
  .source('./template/component')
  .destination((wind.component && wind.component.destination) || './component')
  .clean(false)
  .use(ask)
  .use(componentTemplate)
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

  var questions = require('./questions')

  inquirer.prompt(questions)
    .then(function(answers) {
      Object.assign(metadata, answers);

      if (metadata.confirmComponentPath) {
        done()
      }

    });
}

function printSuccess() {
  info('请按照如下的步骤启动实验室环境')
  info('    * cd lab: 切换到实验室目录')
  info('    * tnpm install: 安装实验室依赖，如果已经安装可以跳过')
  info('    * npm run dev: 启动实验室环境')
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function componentTemplate(files, metalsmith, done) {
  var keys = Object.keys(files)
  var metadata = metalsmith.metadata()

  // 调整组件生成目录
  metalsmith._destination = metalsmith._destination + '/' + metadata.componentName

  info('开始生成组件')

  async.each(keys, run, function() {
    info('生成组件成功')

    // 生成组件调试环境
    if (wind.component.generateEnv) {
      require('./generateLab')(metadata, printSuccess)
    }

    done()
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
