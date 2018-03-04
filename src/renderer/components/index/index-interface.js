import state from './index-state';
import getters from './index-getters';
import actions from './index-actions';
import * as index from './index-mutation-types';

/**
 * [mutations description]
 * @type {Object}
 *  example : [index.SET_EXAMPLE] (state, data) { state.example = data; }
 */
const mutations = {
    [index.SET_INDEX_SHOW] (state, newState) {
        state.show = newState;   
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}