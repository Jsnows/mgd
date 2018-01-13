#!/usr/bin/env node
"use strict"
const program = require('commander');
const server = require('./server.js')

program.parse(process.argv);
/**
 * 当用户没有输入的时候执行
 */
if (!program.args.length){
    server();
}

