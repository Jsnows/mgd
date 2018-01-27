<template>
<div style="height:100%;">
    <Row type="flex" align="middle" style="background-color:#3b454c;height:8%;color:#fff;">
        <Col @click="saveFile()" span="3" offset="1">
            <Tooltip content="快捷键 ⌘ + S">
                <Button id="saveBtn" class="button" @click="saveFile()" type="ghost">保存</Button>
            </Tooltip>
            <Tooltip content="快捷键 ⌘ + shift + S">
                <Button id="saveBtn" class="button" @click="otherSaveFile()" type="ghost">另存为</Button>
            </Tooltip>
        </Col>
        <Col span="4">
            <Tooltip content="快捷键 ⌘ + O">
                <Button class="button" @click="openFile()" type="ghost" icon="ios-cloud-upload-outline">打开文件</Button>
            </Tooltip>
        </Col>
        <Col span="4">
            <Col type="flex" align="middle" span="5">
                <Button class="button" @click="addFontSize()" size="small" type="ghost" shape="circle" icon="plus"></Button>
            </Col>
            <Col type="flex" align="middle" span="14">
                <p>md字体:{{fontsize}}px</p>
            </Col>
            <Col type="flex" align="middle" span="5">
                <Button class="button" @click="minuFontSize()" size="small" type="ghost" shape="circle" icon="minus"></Button>
            </Col>
        </Col>
        <Col span="2" offset="5">
            <!-- <Button @click="handleRender()" class="button" type="ghost">上传至博客</Button> -->
        </Col>
        <Col span="1">
            <Tooltip content="放大视图区">
                <Button class="button" v-show="!show" @click="clickShow()" size="small" type="ghost" shape="circle" icon="arrow-expand"></Button>
            </Tooltip>
            <Tooltip content="缩小视图区">
                <Button class="button" v-show="show" @click="hiddenShow()" size="small" type="ghost" shape="circle" icon="arrow-shrink"></Button>
            </Tooltip>
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
    import {remote,ipcRenderer,Menu,getLocale} from 'electron'
    import fs from 'fs'
    import path from 'path'
    import Util from '../../static/Util.js'
    import Remarkable from 'remarkable'
    import model from './model.js'
    import axios from 'axios'
    import low from 'lowdb'
    import FileSync from 'lowdb/adapters/FileSync'
    const adapter = new FileSync(path.join(__dirname,'../../config.json'))
    const config = low(adapter)
    /**
     *  组件实例对象
     */
    export default {
        components: {
            Row,
            Col,
            Button,
            Upload,
            Tooltip
        },
        data: function() {
            return {
                input:'',
                // fontsize:config.get('editorConfig').value().fontsize, //markdown字体
                fontsize:18,
                fonthtmlsize:18,
                // fonthtmlsize: config.get('editorConfig').value().fonthtmlsize, //html字体
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
            }
        },
        computed: {
            html(){
                let self = this;
                var value = marked(self.input);
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
                config.set('editorConfig.fontsize',self.fontsize+1).write();
                self.fontsize = config.get('editorConfig').value().fontsize;
                self.$refs.textarea.style.fontSize = self.fontsize+'px';
                self.editor.setValue(self.input);
            },
            minuFontSize(){
                let self = this;
                config.set('editorConfig.fontsize',self.fontsize-1).write();
                self.fontsize = config.get('editorConfig').value().fontsize;
                self.$refs.textarea.style.fontSize = self.fontsize+'px';
                self.editor.setValue(self.input);
            },
            addHtmlFontSize(){
                let self = this;
                config.set('editorConfig.fonthtmlsize',self.fonthtmlsize+1).write();
                self.fonthtmlsize = config.get('editorConfig').value().fonthtmlsize;
                self.$refs.div.style.fontSize = self.fonthtmlsize+'px';
            },
            minuHtmlFontSize(){
                let self = this;
                config.set('editorConfig.fonthtmlsize',self.fonthtmlsize-1).write();
                self.fonthtmlsize = config.get('editorConfig').value().fonthtmlsize;
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
                // var clipboardHtml = new Clipboard('.copyhtml',{
                //     text: function(){
                //         if(self.html == ''){
                //             self.$Message.warning('没有可复制的内容');
                //         }
                //         return self.html;
                //     }
                // });
                // clipboardHtml.on('success', function(e){
                //     self.$Message.success('已经将html复制到剪切板');
                // });
                // clipboardHtml.on('error', function(e) {
                //     self.$Message.error('没有复制成功，请使用chrome浏览器');
                // });
            },
            _markedInit(){
                let self = this;
                self.R = new Remarkable('full', {
                    html:         true,        // Enable HTML tags in source
                    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
                    breaks:       true,        // Convert '\n' in paragraphs into <br>
                    langPrefix:   'language-',  // CSS language prefix for fenced blocks
                    linkify:      true,         // autoconvert URL-like texts to links
                    linkTarget:   '',           // set target to open link in

                    // Enable some language-neutral replacements + quotes beautification
                    typographer:  false,
                    // Double + single quotes replacement pairs, when typographer enabled,
                    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
                    quotes: '“”‘’',

                    // Highlighter function. Should return escaped HTML,
                    // or '' if input not changed
                    highlight: function (str, lang) {
                      return high.highlightAuto(str).value;
                    }
                });
                marked.setOptions({
                    renderer: new marked.Renderer(),
                    gfm: true,
                    tables: true,
                    breaks: true,
                    pedantic: true,
                    sanitize: true,
                    smartLists: true,
                    smartypants: true,
                    xhtml: false,
                    highlight: function (code) {
                        return require('highlight.js').highlightAuto(code).value;
                    }
                });
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
                setTimeout(function(){
                    self.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                        mode:'markdown',
                        lineNumbers: true,
                        autoCloseBrackets: true,
                        matchBrackets: true,
                        showCursorWhenSelecting: true,
                        lineWrapping: true,  // 长句子折行
                        theme: "material",
                    });
                    self.editor.on('change', function(a){
                        setTimeout(function(){
                            self.input = a.getValue();    
                        },0);
                    });
                },0)
            }
        },
        beforeCreate(){
            let self = this;
            setTimeout(function(){
                self.$refs.textarea.style.fontSize = self.fontsize+'px';
                self.$refs.div.style.fontSize = self.fonthtmlsize+'px';
                self.$refs.textarea.addEventListener('scroll',function(){
                    var textareaScrollHeight = self.$refs.textarea.scrollHeight;
                    var textareaScrollTop = self.$refs.textarea.scrollTop;
                    var divScollHeight = self.$refs.div.scrollHeight;
                    self.$refs.div.scrollTop = divScollHeight*(textareaScrollTop/textareaScrollHeight);
                });
            },0);
        },
        created() {
            let self = this;
            // 快捷键设置初始化
            self._shortcutkeyInit();
            // 提示初始化
            self._toastInit();
            // marked配置初始化
            self._markedInit();
            // 初始化编辑器 
            self.initEditor();
            model.init();
        }
    }
</script>

<!-- CSS 样式 -->
<style src="../../static/css/iview.css"></style>
<style src="../../node_modules/highlight.js/styles/xcode.css"></style>
<style src="../../node_modules/codemirror/lib/codemirror.css"></style>
<style src="../../node_modules/codemirror/theme/material.css"></style>
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
        border:1px solid #000;
    }
    h1,h2,h3,h4,h5,h6{
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
</style>
