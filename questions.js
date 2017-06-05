'use strict';

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
  }
];

exports.questions = questions
