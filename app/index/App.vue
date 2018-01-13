<template>
<div style="height:100%;">
    <Row type="flex" align="middle" style="background-color:#3b454c;height:8%;color:#fff;">
        <Col span="3" offset="1">
            崔琼雪-mgd
        </Col>
        <Col span="4">
            <Button class="button" @click="openFile()" type="ghost" icon="ios-cloud-upload-outline">打开文件</Button>
            <input style="display:none;" ref="upload" type="file" onchange="file(this)"/>
            <Button class="button btn" type="ghost">复制</Button>
        </Col>
        <Col span="4">
            <Col type="flex" align="middle" span="5">
                <Button class="button" @click="addFontSize()" size="small" type="ghost" shape="circle" icon="plus"></Button>
            </Col>
            <Col type="flex" align="middle" span="14">
                <p>markdown字体:{{fontsize}}px</p>
            </Col>
            <Col type="flex" align="middle" span="5">
                <Button class="button" @click="minuFontSize()" size="small" type="ghost" shape="circle" icon="minus"></Button>
            </Col>
        </Col>
        <Col span="2" offset="5">
            <Button class="button copyhtml" type="ghost">复制html</Button>
        </Col>
        <Col span="1">
            <Button class="button" v-show="!show" @click="clickShow()" size="small" type="ghost" shape="circle" icon="arrow-expand"></Button>
            <Button class="button" v-show="show" @click="hiddenShow()" size="small" type="ghost" shape="circle" icon="arrow-shrink"></Button>
        </Col>
        <Col span="4">
            <Col type="flex" align="middle" span="5">
                <Button class="button" @click="addHtmlFontSize()" size="small" type="ghost" shape="circle" icon="plus"></Button>
            </Col>
            <Col type="flex" align="middle" span="14">
                <p>html字体:{{fonthtmlsize}}px</p>
            </Col>
            <Col type="flex" align="middle" span="5">
                <Button class="button" @click="minuHtmlFontSize()" size="small" type="ghost" shape="circle" icon="minus"></Button>
            </Col>
        </Col>
    </Row>
    <Row style="height:92%;">
        <Col style="height:100%;transition:ease 0.5s;" :span="num1">
            <textarea ref="textarea" class="textarea" v-model="input"></textarea>
        </Col>
        <Col style="height:100%;transition:ease 0.5s;" :span="num2">
            <div ref="div" class="div" v-html="html"></div>
        </Col>
    </Row>
    <!-- <div ref="showDiv" :class="{trans:show}" @click="show=false" class="showDiv" v-html="html"> -->
    </div>
</div>
</template>
<script>
    /**
     *  引入工具类库
     *  example : import apiName from 'api/apiName'
     */
    
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import marked from 'marked'
    import $ from 'zepto'
    import {Row , Col , Button, Upload} from 'iview'
    import high from 'highlight.js'
    import Clipboard from 'clipboard'
    /**
     *  组件实例对象
     */
    export default {
        components: {
            Row,
            Col,
            Button,
            Upload
        },
        data: function() {
            return {
                input:'',
                fontsize:18, //markdown字体
                fonthtmlsize: 18, //html字体
                key:[], //
                filePath: '', //
                show: false, //全屏展示
            }
        },
        computed: {
            html(){
                let self = this;
                return marked(self.input);
            },
            num1(){
                let self = this;
                if(!self.show){
                    return 12
                }else{
                    return 1
                }
            },
            num2(){
                let self = this;
                if(!self.show){
                    return 12
                }else{
                    return 23
                }
            }
        },
        methods: {
            addFontSize(){
                let self = this;
                self.fontsize ++;
                self.$refs.textarea.style.fontSize = self.fontsize+'px';
            },
            minuFontSize(){
                let self = this;
                self.fontsize --;
                self.$refs.textarea.style.fontSize = self.fontsize+'px';
            },
            addHtmlFontSize(){
                let self = this;
                self.fonthtmlsize ++;
                self.$refs.div.style.fontSize = self.fonthtmlsize+'px';
            },
            minuHtmlFontSize(){
                let self = this;
                self.fonthtmlsize --;
                self.$refs.div.style.fontSize = self.fonthtmlsize+'px';
            },
            clickShow(){
                let self = this;
                self.show = true;
                // self.$refs.showDiv.style.fontSize = self.fonthtmlsize+'px';
            },
            hiddenShow(){
                let self = this;
                self.show = false;
                // self.$refs.showDiv.style.fontSize = self.fonthtmlsize+'px';
            },
            openFile(){
                let self = this;
                self.$refs.upload.click();
            }
        },
        beforeCreate(){
            let self = this;
            setTimeout(function(){
                self.$refs.textarea.addEventListener('scroll',function(){
                    var textareaScrollHeight = self.$refs.textarea.scrollHeight;
                    var textareaScrollTop = self.$refs.textarea.scrollTop;
                    var divScollHeight = self.$refs.div.scrollHeight;
                    self.$refs.div.scrollTop = divScollHeight*(textareaScrollTop/textareaScrollHeight);
                });
            },0)
        },
        created() {
            let self = this;
            var clipboard = new Clipboard('.btn',{
                text: function(){
                    if(self.input == ''){
                        self.$Message.warning('没有可复制的内容');
                    }
                    return self.input;
                }
            });
            clipboard.on('success', function(e){
                self.$Message.success('已经将内容复制到剪切板');
            });
            clipboard.on('error', function(e) {
                self.$Message.error('没有复制成功，请使用chrome浏览器');
            });
            var clipboardHtml = new Clipboard('.copyhtml',{
                text: function(){
                    if(self.html == ''){
                        self.$Message.warning('没有可复制的内容');
                    }
                    return self.html;
                }
            });
            clipboardHtml.on('success', function(e){
                self.$Message.success('已经将html复制到剪切板');
            });
            clipboardHtml.on('error', function(e) {
                self.$Message.error('没有复制成功，请使用chrome浏览器');
            });
            marked.setOptions({
                renderer: new marked.Renderer(),
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: false, 
                smartLists: true,
                smartypants: false
            });
            marked.setOptions({
                highlight: function (code) {
                    return high.highlightAuto(code).value;
                }
            });
            setTimeout(function(){
                self.$refs.textarea.style.fontSize = self.fontsize+'px';
                self.$refs.div.style.fontSize = self.fonthtmlsize+'px';
            },0);
            window.onkeydown=function(event){
                var e = event || window.event || arguments.callee.caller.arguments[0];
                self.key.push(e.keyCode);
                // console.log(e.keyCode);
                // console.log(self.key[0]+self.key[1] == 170);
                var all = 0;
                for(let i = 0 ; i < self.key.length ; i++){
                    all += self.key[i];
                }
                if(all == 170){
                    // 禁用组合键
                    e.preventDefault();  
                    window.event.returnValue = false;
                    self.$refs.upload.click();
                    // return
                }else if(all == 158){
                    e.preventDefault();  
                    window.event.returnValue = false;
                    document.querySelector('.btn').click();
                }else if(all == 9){
                    // window.event.returnValue = '    ';
                    // console.log('charCode: '+e.charCode);
                    e.preventDefault();
                }
            };
            window.onkeyup=function(event){
                var e = event || window.event || arguments.callee.caller.arguments[0];
                self.key = [];
                // console.log(self.key);
            };
            window.file = function(input){
                if (window.FileReader) {  
                    var file = input.files[0];  
                    var filename = file.name.split(".")[0];  
                    var reader = new FileReader();
                    reader.onload = function() {
                        self.input = this.result;
                    }
                    reader.readAsText(file);  
                }
            }
        }
    }

    
</script>

<!-- CSS 样式 -->
<style src="../../node_modules/iview/dist/styles/iview.css"></style>
<style src="../../node_modules/highlight.js/styles/default.css"></style>
<style>
    *{
        -webkit-tap-highlight-color:transparent;
    }
    .textarea{
        overflow:auto;
        background-attachment:fixed;
        background-repeat:no-repeat;
        border-style:solid;
        border-color:#FFFFFF;
        border-radius: 5px;
        float:left;
        width:100%;
        height:100%;
        overflow:auto;
        /*outline:thin solid #b0b0b0;*/
        outline:none;
        resize:none;
        margin: 0 2px;
        padding:10px;
        background-color:#ead1b2;
        color:#474747;
    }
    .div{
        float:left;
        width:100%;
        height:100%;
        margin: 0 2px;
        padding:10px;
        overflow:auto;
    }
    .showDiv{
        position:absolute;
        top:0px;
        left:0px;
        background-color:#fff;
        padding:10px;
        overflow:auto;
        padding-left:20px;
        height:0%;
        width:0%;
        transition:ease .5s;
    }
    .trans{
        height:100%;
        width:100%;
    }
    .button{
        color:#fff;
    }
</style>
