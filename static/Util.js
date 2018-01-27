const Util = {
    // 加强循环
    fors : function(obj,callback){
        let keys = Object.keys(obj);
        let length = keys.length;
        for(let i = 0 ; i < length ; i++){
            if(obj.constructor == Object){
                if(callback(obj[keys[i]],keys[i]) == false){
                    return
                }
            }else if(obj.constructor == Array){
                if(callback(obj[keys[i]],i) == false){
                    return
                }
            }
        }
    },
    // 快捷键
    checkKeyCode:function(codeArr,trueArr){
        if(codeArr.length !== trueArr.length){
            return false
        }else{
            for(let i = 0 ; i < codeArr.length ; i++){
                if(trueArr.indexOf(codeArr[i]) == -1){
                    return false
                }
            }
            return true
        }
    }
}
export default Util;