import {babelTester} from 'test-utils'
import plugin from './index'

babelTester('@emotion/babel-plugin-core', __dirname, {
  // we add a duplicate of our own plugin
  // users may run babel twice, and our plugin should be smart enough to not duplicate fields
  plugins: [plugin],
})

babelTester('@emotion/babel-plugin-core', __dirname, {
  // we add a duplicate of our own plugin
  // users may run babel twice, and our plugin should be smart enough to not duplicate fields
  plugins: [[plugin, {instances: ['./src/styles']}]],
})
