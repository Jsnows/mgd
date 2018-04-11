exports.diff = diffTag
exports.contrast = contrast
function diffTag(oDom,nDom){
    // console.log(oDom)
    // console.log(nDom)
    if(oDom.type !== nDom.type){
        return false
    }
    if(oDom.type !== 1 && nDom.type !== 1){
        if(oDom.text !== nDom.text){
            return false
        }else{
            return true
        }
    }
    var same = true;
    // 1.比较tag 是否相同
    // 2.比较attrsList.length 是否相同
    // console.log(oDom)
    if(oDom.tag !== nDom.tag || oDom.attrsList.length !== nDom.attrsList.length){
        // console.log('2')
        return false
    }
    // 3.比较属性值是否相同
    for(let i = 0 ; i < oDom.attrsList.length ; i ++){
        if(nDom.attrsMap[oDom.attrsList[i].name] !== oDom.attrsList[i].value){
            return false
        }
    }
    return forsChild(oDom.children,nDom.children)
}
function forsChild(oChild,nChild){
    var same = true;
    if(oChild.length == 0 && nChild.length == 0){
        // 没有子节点
        return true
    }
    if(oChild.length !== nChild.length){
        // 子节点个数不同
        return false
    }

    for(let i = 0 ; i < oChild.length ; i ++){
        if(!same){
            return false
        }
        if(oChild[i].type !== nChild[i].type){
            return false
        }else{
            if(!diffTag(oChild[i],nChild[i])){
                same = false
            }else{
                if(oChild[i].type == 1){
                    same = forsChild(oChild[i].children,nChild[i].children)    
                }
            }
        }
    }
    return same
}
function contrast(oldDom,newDom){
    var oldPoint = 0;
    var del = [];
    if(oldDom.children.length !== 0 && newDom.children.length !== 0){
        for(let i = 0 ; i < oldDom.children.length ; i++){
            var same = false
            for(let a = 0 ; a < newDom.children.length ; a++){
                // 如果DOM相同就标记
                if(diffTag(oldDom.children[i],newDom.children[a]) && !newDom.children[a].has && !oldDom.children[i].used && newDom.children[a].has !== 0){
                    same = true
                    newDom.children[a].has = i
                    oldDom.children[i].used = true
                    continue
                }
            }
            if(!same){
                var obj = {
                    tag:oldDom.children[i].tag,
                    index:i
                }
                del.push(obj)
            }
        }
        for(let i = 0 ; i < newDom.children.length ; i++){
            try{
                console.log(newDom.children[i].has)
            }catch(err){

            }
            delete newDom.children[i].children
            delete newDom.children[i].parent
            delete newDom.children[i].attrsList
            delete newDom.children[i].attrsMap
            delete newDom.children[i].type
        }
        // console.log(del)
        // console.log(newDom)
    }
}
