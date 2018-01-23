/**
 *  引入框架
 */
import Vue from 'vue'
import Vuex from 'vuex'

/**
 *  引入工具类库 或 模块API
 */
import Index from './components/index/index-interface.js'
/**
 *  引入组件的接口文件(Interface)
 *  example : import SomeInterface from 'components/Some/SomeInterface'
 */

Vue.use(Vuex)
/**
 * [modules 接口写成模块]
 * @type {Object}
 */
export default new Vuex.Store({
    modules: {
        Index
    }
})
