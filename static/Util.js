const Util = {
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