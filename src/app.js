import './sass/global.scss'
import '@babel/polyfill'
import fp from 'lodash/fp'

import { b } from './js/hello'

console.log(b, fp.join(',', 'bbb'))
const a = 0
