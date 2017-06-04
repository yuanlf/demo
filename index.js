'use strict';

var chalk = require('chalk');
var async = require('async');
var rm = require('rimraf');
var Metalsmith = require('metalsmith');
var prompt = require('cli-prompt');
var inquirer = require('inquirer')
var render = require('consolidate')
  .handlebars.render;
var spawn = require('child_process')
  .spawn;

var metalsmith = Metalsmith(__dirname)
  .metadata({
    title: "My Static Site & Blog",
    description: "It's about saying »Hello« to the World.",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./template')
  .destination('./build')
  .clean(false)
  .use(ask)
  .use(template)
  .build(function(err) {
    if (err) throw err;
  });

/**
 * Prompt plugin.
 * 
 * @param {Object} files 
 * @param {Metalsmith} metalsmith 
 * @param {Function} done 
 */
function ask(files, metalsmith, done) {
  var prompts = ['name', 'repository', 'description', 'license'];
  var metadata = metalsmith.metadata();

  // async.eachSeries(prompts, run, done);

  // function run(key, done) {
  //   prompt('  ' + key + ': ', function(val) {
  //     metadata[key] = val;
  //     done();
  //   });
  // }

  // exec('input.js', { stdio: 'inherit', cwd: __dirname }, function(err, stdout, stderr) {
  //   console.log(1111)
  //   done();
  // })

  var questions = [{
      type: 'input',
      name: 'first_name',
      message: 'What\'s your first name'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What\'s your last name',
      default: function() {
        return 'Doe';
      }
    },
    {
      type: 'input',
      name: 'phone',
      message: 'What\'s your phone number',
      validate: function(value) {
        var pass = value.match(
          /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
        );
        if (pass) {
          return true;
        }

        return 'Please enter a valid phone number';
      }
    }
  ];

  inquirer.prompt(questions)
    .then(function(answers) {
      Object.assign(metadata, answers);

      // console.log(metadata)
      console.log(JSON.stringify(answers, null, '  '));

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
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();

  async.each(keys, run, done);

  function run(file, done) {
    console.log(file)
    var str = files[file].contents.toString();
    render(str, metadata, function(err, res) {
      if (err) return done(err);
      files[file].contents = new Buffer(res);

      // chalk.green('create file %s successfully!', file);

      done();
    });
  }
}
