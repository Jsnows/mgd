<template>
    
    <div>这个是组件{{get_index_main}}</div>

</template>

<script>
    /**
     *  引入工具类库 或 Navtive API
     *  example : import widget from 'gapi/widget'
     */

    /**
     *  引入mutation-types
     *  example : import * as index from './index'
     */
    import {mapGetters} from 'vuex'
    export default {
        data: function() {
            return {
                
            }
        },
        computed: {
            ...mapGetters(['get_index_main'])
        },
        methods: {
            
        },
        created () {
            
        }
    }

    
</script>

<!-- CSS 样式 -->
<!-- <style src="static/css/global.css"></style> -->


