var o = 'ABCABBBCBABBSA';
var n = 'CBABACABCBSAA';
var oldArr = o.split('');
var newArr = n.split('');

function myers(oArr,nArr,diff){
    let maxPath = []; //最短路径
    let cache = []; //临时存储路劲
    let all = []; //所有可以走斜线的点
    diff = diff || null;
    if(diff){
        if(diff.constructor !== Function){
            throw 'diff必须是一个方法'
            return
        }
    }
    // 寻找最短路径
    function findPath(obj,arr) {
        var child = [];
        for(let i = 0 ; i < arr.length ; i++){
            if(arr[i][0] > obj[0] && arr[i][1] > obj[1]){
                child.push(arr[i])
            }
        }
        if(child.length == 0){
            cache.push(obj)
            if(cache.length > maxPath.length){
                maxPath = deepClone(cache)
            }
            cache.pop()
            cache.pop()
            return false
        }else{
            if(child.length == 1 && child[0] == obj){
                if(cache.length > maxPath.length){
                    maxPath = cache
                }
                cache.pop();
                return false
            }
            cache.push(obj)
            for(let i = 0 ; i < child.length ; i++){
                findPath(child[i],child) 
            }
        }
    }
    // 路径补全
    function completion(maxPath){
        // 路径补全(补斜线尾点)
        for(let i = 0 ; i < maxPath.length ; i++){
            let add = [maxPath[i][0]+1,maxPath[i][1]+1]
            if(maxPath[i+1]){
                if(add[0] !== maxPath[i+1][0] || add[1] !== maxPath[i+1][1]){
                    maxPath.splice(i+1,0,add)
                    i++
                }
            }else{
                maxPath.splice(i+1,0,add)
                i++
            }
        }
        // 添加首尾元素
        maxPath.push([oArr.length,nArr.length])
        maxPath.unshift([0,0])
        for(let i = 0 ; i < maxPath.length ; i++){
            if(maxPath[i+1]){
                var dValue = [maxPath[i+1][0]-maxPath[i][0]-1,maxPath[i+1][1]-maxPath[i][1]-1];
                while(dValue[0] > 0 || dValue[1] > 0){
                    if(dValue[0] > 0){
                        var sert = [maxPath[i][0] + 1,maxPath[i][1]]
                        maxPath.splice(i+1,0,sert)
                        dValue[0]--
                        i++
                    }else{
                        var sert = [maxPath[i][0],maxPath[i][1] + 1]
                        maxPath.splice(i+1,0,sert)
                        dValue[1]--
                        i++
                    }
                }
            }
        }
    }
    // 深度拷贝
    function deepClone(arr){
        var obj = [];
        for(let i = 0 ; i < arr.length ; i++){
            obj[i] = arr[i]
        }
        return obj
    }
    // 找出所有对角线
    for(let i = 0 ; i < oArr.length ; i ++){
        for(let a = 0 ; a < nArr.length ; a++){
            if(diff){
                if(diff(oArr[i],nArr[a])){
                    let obj = []
                    obj.push(i)
                    obj.push(a)
                    all.push(obj)
                }
            }else{
                if(oArr[i] == nArr[a]){
                    let obj = []
                    obj.push(i)
                    obj.push(a)
                    all.push(obj)
                }
            }
        }
    }
    // 找出走最多斜线的路径
    for(let i = 0 ; i < all.length ; i++){
        findPath(all[i],all)
    }
    completion(maxPath)
    return maxPath
}

var maxPath = myers(oldArr,newArr)
for(let i = 0 ; i < maxPath.length ; i++){
    if(maxPath[i+1]){
        var d = [maxPath[i+1][0]-maxPath[i][0],maxPath[i+1][1]-maxPath[i][1]]
        if(d[0] == 1 && d[1] == 1){
            console.log(`  ${n[maxPath[i][1]]}`)
        }else if(d[0] == 1 && d[1] == 0){
            console.log(`- ${o[maxPath[i][0]]}`)
        }else if(d[0] == 0 && d[1] == 1){
            console.log(`+ ${n[maxPath[i][1]]}`)
        }
    }
}


