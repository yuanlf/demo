'use strict';

var path = require('path')

// wind配置文件
var wind = require('./wind')

var windComponentDestination = path.resolve((wind.component && wind.component.destination) || './component')

var questions = [{
    type: 'input',
    name: 'componentName',
    message: '请输入组件名称',
    validate: function(value) {
      var pass = value.match(/^[A-Z][0-9a-zA-Z_]{1,}$/)

      if (pass) {
        return true;
      }

      return "组件名称只能包含字母，数字和下划线，并且首字母必须大写"
    }
  },
  {
    type: 'confirm',
    name: 'confirmComponentPath',
    message: `组件会生成到此目录：${windComponentDestination}，是否确认？`,
    validate: function(value) {

    }
  }
  // {
  //   type: 'confirm',
  //   name: 'confirmGenerateLab',
  //   message: `是否需要生成组件环境？`,
  //   validate: function(value) {

  //   }
  // }
  // {
  //   type: 'confirm',
  //   name: 'confirmInstallModule',
  //   message: `是否自动安装npm模块？`,
  //   validate: function(value) {

  //   }
  // }
];

module.exports = questions
