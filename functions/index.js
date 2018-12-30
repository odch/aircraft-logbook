/** EXPORT ALL FUNCTIONS
 *
 *   - Loads all `.function.js` files
 *   - Supports multiple exports from a single `.function.js` file
 *   - It is optimized with `FUNCTION_NAME` env and omiting `node_modules` as well
 *   - Every function from any file must have unique name
 *   - Default export is not supported (`module.exports = ...`), instead use: `module.exports.functionName = ...`
 *
 *   Based on this thread:
 *     https://github.com/firebase/functions-samples/issues/170
 */
const glob = require('glob')
const files = glob.sync('./**/*.function.js', {
  cwd: __dirname,
  ignore: './node_modules/**'
})

files.forEach(file => {
  const functionModule = require(file)
  const functionNames = Object.keys(functionModule)

  functionNames.forEach(functionName => {
    if (
      !process.env.FUNCTION_NAME ||
      process.env.FUNCTION_NAME === functionName
    ) {
      exports[functionName] = functionModule[functionName]
    }
  })
})
