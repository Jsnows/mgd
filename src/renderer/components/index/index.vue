<template>
    <div ref="aaa" :class="{aa:get_index_show == 1}" class="test">
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>
    </div>
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
            ...mapGetters(['get_index_show'])
        },
        methods: {
            
        },
        created () {
            let self = this;
        }
    }

    
</script>

<!-- CSS 样式 -->
<!-- <style src="static/css/global.css"></style> -->
<style>
    .test{
        /*border:1px solid red;*/
        position:absolute;
        height:0px;
        width:40%;
        background:rgba(255,255,255,0);
        top:-10px;
        left:30%;
        z-index:1000;
        transition: ease 0.5s;
        overflow: hidden;
    }
    .aa{
        height:auto;
        top:100px;
        background:rgba(255,255,255,1);
    }
</style>


