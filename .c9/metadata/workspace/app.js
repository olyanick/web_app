{"changed":false,"filter":false,"title":"app.js","tooltip":"/app.js","value":"/**\n * app.js\n *\n * Use `app.js` to run your app without `sails lift`.\n * To start the server, run: `node app.js`.\n *\n * This is handy in situations where the sails CLI is not relevant or useful.\n *\n * For example:\n *   => `node app.js`\n *   => `forever start app.js`\n *   => `node debug app.js`\n *   => `modulus deploy`\n *   => `heroku scale`\n *\n *\n * The same command-line arguments are supported, e.g.:\n * `node app.js --silent --port=80 --prod`\n */\n\n// Ensure we're in the project directory, so relative paths work as expected\n// no matter where we actually lift from.\nprocess.chdir(__dirname);\n\n// Ensure a \"sails\" can be located:\n(function() {\n  var sails;\n  try {\n    sails = require('sails');\n  } catch (e) {\n    console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');\n    console.error('To do that, run `npm install sails`');\n    console.error('');\n    console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');\n    console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');\n    console.error('but if it doesn\\'t, the app will run with the global sails instead!');\n    return;\n  }\n\n  // Try to get `rc` dependency\n  var rc;\n  try {\n    rc = require('rc');\n  } catch (e0) {\n    try {\n      rc = require('sails/node_modules/rc');\n    } catch (e1) {\n      console.error('Could not find dependency: `rc`.');\n      console.error('Your `.sailsrc` file(s) will be ignored.');\n      console.error('To resolve this, run:');\n      console.error('npm install rc --save');\n      rc = function () { return {}; };\n    }\n  }\n\n\n  // Start server\n  sails.lift(rc('sails'));\n})();\n","undoManager":{"mark":-1,"position":-1,"stack":[]},"ace":{"folds":[],"scrolltop":728.5,"scrollleft":0,"selection":{"start":{"row":0,"column":0},"end":{"row":0,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":51,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1456689832170}