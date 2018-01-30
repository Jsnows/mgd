<template>
<div style="height:100%;">
    <Row type="flex" align="middle" style="background-color:#3b454c;height:8%;color:#fff;">
        <Col span="3" offset="1">
            <i-select size="small" style="width:150px;" @on-change="changeHighlight" :filterable="true" placeholder="切换高亮主题" class="ul" v-model="theme">
                <i-option v-for="item in themeArr" :value="item">{{ item }}</i-option>
            </i-select>
        </Col>
        <Col span="2" offset="1">
            高性能 : 
            <i-switch @on-change="performance">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </i-switch>
        </Col>
        <Col span="2" offset="1">
            <Button size="small" @click="handleRender()" class="button" type="ghost">上传至博客</Button>
        </Col>
    </Row>
    <Row style="height:92%;">
        <Col style="height:100%;transition:ease 0.5s;" :span="num1">
            <div ref="textarea" style="height:100%;">
                <textarea id="code" class="textarea" v-model="input"></textarea>
            </div>
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
    import CodeMirror from 'codemirror'
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import marked from 'marked'
    import {Row , Col , Button, Upload,Tooltip} from 'iview'
    import high from 'highlight.js'
    import Clipboard from 'clipboard'
    import {remote,app} from 'electron'
    import fs from 'fs'
    import path from 'path'
    import Util from '../../static/Util.js'
    import model from './model.js'
    import axios from 'axios'
    const Store = require('electron-store');
    const store = new Store();

    /**
     *  组件实例对象
     */
    export default {
        components: {
            Row,
            Col,
            Button,
            Upload,
            Tooltip,
        },
        data: function() {
            return {
                input:'',
                fontsize:store.get('fontsize') || 18,
                fonthtmlsize:store.get('fonthtmlsize') || 18,
                key:[], //
                filePath: '', //
                show: false, //全屏展示
                num:0,
                saveFileOptions:{
                    title: '保存文件',
                    filters: [
                      { name: 'text', extensions: ['md'] }
                    ]
                },
                postText:{}, //上传的数据
                icons: '', //图标字符串
                postConfig:{
                    secret:{
                        text:'密码：',
                        placeholder:'请输入密码...'
                    },
                    name:{
                        text:'文章名：',
                        placeholder:'请输入文章名...'
                    },
                    desc:{
                        text:'描述：',
                        placeholder:'请输入描述...'
                    },
                    img:{
                        text:'图片URL：',
                        placeholder:'请输入图片链接...'
                    },
                    iconsStr:{
                        text:'图标：',
                        placeholder:'请输入图标名称，例如：social-github'
                    },
                    file_name:{
                        text:'保存文件名',
                        placeholder:'请输入要保存的文件名...'
                    }
                },
                editor:null,
                cache:[],
                noHigh:false,
                keyDownTime:'',
                timer:null,
                theme: store.get('theme'),
                themeArr:[
                "default",
                "3024-day",
                "3024-night",
                "abcdef",
                "ambiance",
                "base16-dark",
                "base16-light",
                "bespin",
                "blackboard",
                "cobalt",
                "colorforth",
                "dracula",
                "duotone-dark",
                "duotone-light",
                "eclipse",
                "elegant",
                "erlang-dark",
                "hopscotch",
                "icecoder",
                "isotope",
                "lesser-dark",
                "liquibyte",
                "material",
                "mbo",
                "mdn-like",
                "midnight",
                "monokai",
                "neat",
                "neo",
                "night",
                "oceanic-next",
                "panda-syntax",
                "paraiso-dark",
                "paraiso-light",
                "pastel-on-dark",
                "railscasts",
                "rubyblue",
                "seti",
                "shadowfox",
                "solarized dark",
                "solarized light",
                "the-matrix",
                "tomorrow-night-bright",
                "tomorrow-night-eighties",
                "ttcn",
                "twilight",
                "vibrant-ink",
                "xq-dark",
                "xq-light",
                "yeti",
                "zenburn",],
                theme:''
            }
        },
        computed: {
            html(){
                let self = this;
                var value = marked(self.input);
                // console.log(new Date().getTime() - start);
                return value
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
                self.fontsize++
                store.set('fontsize',self.fontsize);
                self.$refs.textarea.style.fontSize = self.fontsize+'px';
                self.editor.setValue(self.input);
            },
            minuFontSize(){
                let self = this;
                self.fontsize--
                store.set('fontsize',self.fontsize);
                self.$refs.textarea.style.fontSize = self.fontsize+'px';
                self.editor.setValue(self.input);
            },
            addHtmlFontSize(){
                let self = this;
                self.fonthtmlsize++
                store.set('fonthtmlsize',self.fontsize);
                self.$refs.div.style.fontSize = self.fonthtmlsize+'px';
            },
            minuHtmlFontSize(){
                let self = this;            
                self.fonthtmlsize--
                store.set('fonthtmlsize',self.fontsize);
                self.$refs.div.style.fontSize = self.fonthtmlsize+'px';
            },
            clickShow(){
                let self = this;
                self.show = true;
            },
            hiddenShow(){
                let self = this;
                self.show = false;
            },
            openFile(){
                let self = this;
                remote.dialog.showOpenDialog({
                    properties:['openFile'],
                    filters: [
                        { name: 'text', extensions: ['md'] },
                    ]
                },function(file){
                    self.key = [];
                    if(file){
                        document.getElementsByTagName('title')[0].innerHTML = file[0];
                        self.filePath = file[0];
                        self.input = fs.readFileSync(file[0]).toString();
                        document.getElementById("code").innerHTML = self.input;
                        self.editor.setValue(self.input);
                    }
                });
            },
            saveFile(){
                let self = this;
                if(self.filePath){
                    fs.writeFile(self.filePath, self.input, (err) => {
                        if (err){
                            console.log(err);
                            return
                        };
                        self.$Message.success('保存成功');
                    });
                }else{
                    if(!self.input){
                        self.$Message.warning('内有任何内容');
                    }else{
                        remote.dialog.showSaveDialog(self.saveFileOptions, function (filename) {
                            self.key = [];
                            if(filename){
                                fs.writeFile(filename, self.input, (err) => {
                                    if (err){
                                        console.log(err);
                                        return
                                    };
                                    self.filePath = filename;
                                    self.$Message.success('保存成功');
                                });
                            }
                        })
                    }
                }
            },
            otherSaveFile(){
                let self = this;
                remote.dialog.showSaveDialog(self.saveFileOptions, function (filename) {
                    self.key = [];
                    if(filename){
                        fs.writeFile(filename, self.input, (err) => {
                            if (err){
                                console.log(err);
                                return
                            };
                            self.filePath = filename;
                            self.$Message.success('保存成功');
                        });
                    }
                })
            },
            _shortcutkeyInit(){
                let self = this;
                window.onkeydown=function(event){
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    if(self.key.indexOf(e.keyCode)==-1){
                        self.key.push(e.keyCode)  
                    }
                    // console.log(e.keyCode);
                    // console.log(self.key[0]+self.key[1] == 170);
                    if(Util.checkKeyCode(self.key,[91,79])){
                        // 打开快捷键91,79
                        self.openFile();
                        e.preventDefault();  
                        window.event.returnValue = false;
                        return
                    }else if(Util.checkKeyCode(self.key,[91,83])){
                        // 保存快捷键91,83
                        self.saveFile();
                        e.preventDefault();  
                        window.event.returnValue = false;
                        return
                    }else if(Util.checkKeyCode(self.key,[91,83,16])){
                        self.otherSaveFile();
                        e.preventDefault();  
                        window.event.returnValue = false;
                        return
                    }else if(Util.checkKeyCode(self.key,[9])){
                        e.preventDefault();  
                        window.event.returnValue = false;
                    }
                };
                window.onkeyup=function(event){
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    self.key = [];
                };
            },
            _toastInit(){
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
            },
            _markedInit(){
                let self = this;
                marked.setOptions({
                    renderer: new marked.Renderer(),
                    gfm: true,
                    tables: true,
                    breaks: true,
                    pedantic: true,
                    sanitize: false,
                    smartLists: true,
                    smartypants: true,
                    xhtml: true,
                    highlight: function (code) {
                        if(self.noHigh){
                            return code
                        }
                        if(self.cache.length !== 0){
                            for(let i = 0 ; i < self.cache.length ; i++){
                                if(self.cache[i].code == code){
                                    return self.cache[i].highCode;
                                }
                            }
                            var obj = {
                                code:code,
                                highCode:high.highlightAuto(code).value
                            }
                            self.cache.push(obj);
                            return obj.highCode;    
                        }else{
                            var obj = {
                                code:code,
                                highCode:high.highlightAuto(code).value
                            }
                            self.cache.push(obj);
                            return obj.highCode;
                        }
                    }
                });
            },
            changeHighlight(theme){
                let self = this;
                self.editor.setOption("theme",theme);
                store.set('theme',theme);
            },
            updata(){
                let self = this;
                if(!self.input){
                    self.$Message.error('文件内容为空');
                    return
                }
                self.postText.icons = self.postText.iconsStr.split(',');
                self.postText.content = self.input;
                axios.post('http://www.jsnows.com/updata',self.postText)
                .then(function (response) {
                    if(response.data.code == 0){
                        self.$Message.success('上传成功');
                        self.$Modal.remove();
                        self.postText = {};
                    }else{
                        self.$Modal.remove();
                        self.$Message.error(response.data.message);
                    }
                })
                .catch(function (error) {
                    self.$Modal.remove();
                    self.$Message.error('上传失败');
                });
            },
            handleRender () {
                let self = this;
                var parms = ['secret','name','desc','iconsStr','img','file_name'];
                this.$Modal.confirm({
                    render: (h) => {
                        return h('div',{},[
                            parms.map(function (file) {
                                return h('Row',{
                                    style:{
                                        marginBottom:'10px',
                                        alignItems: 'center'
                                    },
                                    props:{
                                        type:'flex',
                                    }
                                },[
                                    h('Col',{
                                        props:{
                                            span:6,
                                            type:'flex'
                                        },
                                        style:{
                                            fontSize:'14px'
                                        }
                                    },[
                                       self.postConfig[file].text
                                    ]),
                                    h('Col',{
                                        props:{
                                            span:18
                                        }
                                    },[
                                        h('Input',{
                                            props: {
                                                value:self.postText[file] || '',
                                                autofocus: true,
                                                placeholder: self.postConfig[file].placeholder
                                            },
                                            on:{
                                                input: (val) => {
                                                    if(file == 'file_name'){
                                                        if(val.indexOf('.md') !== -1){
                                                            self.$Message.error('不需要添加.md后缀');
                                                            return
                                                        }
                                                    }
                                                    if(file == 'icons'){
                                                        if(val.indexOf('，') !== -1){
                                                            self.$Message.error('禁止使用中文逗号');
                                                            return
                                                        }
                                                    }
                                                    if(file == 'icons'){
                                                        self.icons = val;
                                                    }else{
                                                        self.postText[file] = val;    
                                                    }
                                                }
                                            }
                                        }),
                                    ])
                                ])
                            })]
                        )
                    },
                    onOk:function(){
                        self.updata();
                    },
                    loading:true
                })
            },
            initEditor(){
                let self = this;
                require('../../node_modules/codemirror/mode/markdown/markdown.js');
                require('../../node_modules/codemirror/mode/javascript/javascript.js');
                require('../../node_modules/codemirror/mode/php/php.js');
                setTimeout(function(){
                    window.hiddenWindow();
                    self.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                        mode:'markdown',
                        lineNumbers: true,
                        autoCloseBrackets: true,
                        matchBrackets: true,
                        showCursorWhenSelecting: true,
                        lineWrapping: true,  // 长句子折行
                        theme: self.theme,
                    });
                    self.editor.on('change', function(a){
                        var tt = new Date().getTime() - self.keyDownTime;
                        self.keyDownTime = new Date().getTime();
                        if(tt < 250){
                            clearInterval(self.timer);
                            self.timer = setTimeout(function(){
                                self.input = a.getValue();
                            },250)
                        }else{
                            setTimeout(function(){
                                self.input = a.getValue();    
                            },0)
                        }
                    });
                },0)
            },
            performance(status){
                let self = this;
                self.noHigh = status;
            },
            help(){
                alert('help');
            },
            openNewWindow(){
                // const winURL = process.env.NODE_ENV === 'development'
                //   ? `http://localhost:9080`
                //   : `file://${__dirname}/index.html`
                // let win = new remote.BrowserWindow({
                //     useContentSize: true,
                //     minWidth:1000,
                //     minHeight:600,
                //     width:2000,
                //     height:2000,
                // });
                // win.loadURL(winURL)
                // win.on('closed', () => {
                //     win = null
                // })
            }
        },
        beforeCreate(){
            let self = this;
            setTimeout(function(){
                // 同步滚动 v.bate
                // self.$refs.textarea.style.fontSize = self.fontsize+'px';
                // self.$refs.div.style.fontSize = self.fonthtmlsize+'px';
                // self.$refs.textarea.addEventListener('scroll',function(){
                //     var textareaScrollHeight = self.$refs.textarea.scrollHeight;
                //     var textareaScrollTop = self.$refs.textarea.scrollTop;
                //     var divScollHeight = self.$refs.div.scrollHeight;
                //     self.$refs.div.scrollTop = divScollHeight*(textareaScrollTop/textareaScrollHeight);
                // });
            },0);
        },
        created() {
            let self = this;
            self.theme = store.get('theme') || 'material';
            // 快捷键设置初始化
            self._shortcutkeyInit();
            // 提示初始化
            self._toastInit();
            // marked配置初始化
            self._markedInit();
            // 初始化编辑器 
            self.initEditor();
            model.init(self);
        }
    }
</script>

<!-- CSS 样式 -->
<style src="../../static/css/iview.css"></style>
<style src="../../node_modules/highlight.js/styles/xcode.css"></style>
<style src="../../node_modules/codemirror/lib/codemirror.css"></style>
<style src="../../node_modules/codemirror/theme/material.css"></style>
<style src="../../node_modules/codemirror/theme/3024-day.css"></style>
<style src="../../node_modules/codemirror/theme/3024-night.css"></style>
<style src="../../node_modules/codemirror/theme/abcdef.css"></style>
<style src="../../node_modules/codemirror/theme/ambiance.css"></style>
<style src="../../node_modules/codemirror/theme/base16-dark.css"></style>
<style src="../../node_modules/codemirror/theme/bespin.css"></style>
<style src="../../node_modules/codemirror/theme/base16-light.css"></style>
<style src="../../node_modules/codemirror/theme/blackboard.css"></style>
<style src="../../node_modules/codemirror/theme/cobalt.css"></style>
<style src="../../node_modules/codemirror/theme/colorforth.css"></style>
<style src="../../node_modules/codemirror/theme/dracula.css"></style>
<style src="../../node_modules/codemirror/theme/duotone-dark.css"></style>
<style src="../../node_modules/codemirror/theme/duotone-light.css"></style>
<style src="../../node_modules/codemirror/theme/eclipse.css"></style>
<style src="../../node_modules/codemirror/theme/elegant.css"></style>
<style src="../../node_modules/codemirror/theme/erlang-dark.css"></style>
<style src="../../node_modules/codemirror/theme/hopscotch.css"></style>
<style src="../../node_modules/codemirror/theme/icecoder.css"></style>
<style src="../../node_modules/codemirror/theme/isotope.css"></style>
<style src="../../node_modules/codemirror/theme/lesser-dark.css"></style>
<style src="../../node_modules/codemirror/theme/liquibyte.css"></style>
<style src="../../node_modules/codemirror/theme/material.css"></style>
<style src="../../node_modules/codemirror/theme/mbo.css"></style>
<style src="../../node_modules/codemirror/theme/mdn-like.css"></style>
<style src="../../node_modules/codemirror/theme/midnight.css"></style>
<style src="../../node_modules/codemirror/theme/monokai.css"></style>
<style src="../../node_modules/codemirror/theme/neat.css"></style>
<style src="../../node_modules/codemirror/theme/neo.css"></style>
<style src="../../node_modules/codemirror/theme/night.css"></style>
<style src="../../node_modules/codemirror/theme/oceanic-next.css"></style>
<style src="../../node_modules/codemirror/theme/panda-syntax.css"></style>
<style src="../../node_modules/codemirror/theme/paraiso-dark.css"></style>
<style src="../../node_modules/codemirror/theme/paraiso-light.css"></style>
<style src="../../node_modules/codemirror/theme/pastel-on-dark.css"></style>
<style src="../../node_modules/codemirror/theme/railscasts.css"></style>
<style src="../../node_modules/codemirror/theme/rubyblue.css"></style>
<style src="../../node_modules/codemirror/theme/seti.css"></style>
<style src="../../node_modules/codemirror/theme/shadowfox.css"></style>
<style src="../../node_modules/codemirror/theme/solarized.css"></style>
<style src="../../node_modules/codemirror/theme/the-matrix.css"></style>
<style src="../../node_modules/codemirror/theme/tomorrow-night-bright.css"></style>
<style src="../../node_modules/codemirror/theme/tomorrow-night-eighties.css"></style>
<style src="../../node_modules/codemirror/theme/ttcn.css"></style>
<style src="../../node_modules/codemirror/theme/twilight.css"></style>
<style src="../../node_modules/codemirror/theme/vibrant-ink.css"></style>
<style src="../../node_modules/codemirror/theme/xq-dark.css"></style>
<style src="../../node_modules/codemirror/theme/xq-light.css"></style>
<style src="../../node_modules/codemirror/theme/yeti.css"></style>
<style src="../../node_modules/codemirror/theme/zenburn.css"></style>
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
        background-color:#e1d2b2;
        color:#4d4d4d;
    }
    .div{
        float:left;
        width:100%;
        height:100%;
        margin: 0 2px;
        padding:10px;
        overflow:auto;
        /*background-color: #303548;*/
        /*color:#fff;*/
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
    pre{border:1px solid #a9a9a9; border-radius: 5px; padding:20px;}
    /*code{color:#c7254e;}*/
    pre {
      margin-top: 0;
      margin-bottom: 1rem;
      overflow: auto;
      -ms-overflow-style: scrollbar;
    }
    
    code {
      font-size: 87.5%;
      color: #e83e8c;
      word-break: break-word;
    }
    pre {
      display: block;
      font-size: 87.5%;
      color: #363636;
    }
    pre code {
      font-size: inherit;
      color: inherit;
      word-break: normal;
    }
    p{
        margin-bottom: 10px;
        /*padding-left:20px;*/
        /*text-indent:2rem;*/
    }
    table{
        width: 100%;
    }
    th,tr,td{
        text-align:center;
        background-color: #dadada;
        /*border:1px solid #000;*/
    }
    h1,h2,h3,h4,h5,h6{
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    .ul ul{
        padding: 0px;
    }
    .windowImg{
        background-image: url(../../static/logo.png);
    }
</style>