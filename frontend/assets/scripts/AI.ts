namespace AI{
    	
	let CHESS_TYPE = cc.Enum({
        WUZI: -1,
        
        SIZI: -1,
        SIZI_NO_MID:-1,
        SIZI_NO_END:-1,

        SANZI:-1,
        SANZI_NOEND:-1,

        ERZI:-1,
        
	});

    let chessScore = [
        99999999,

        100000,
        40000,
        40000,

        50000,
        10000,

        100

    ]

    let testScore = [
        0,0,10,50,5000,99999
    ]


    export function test(){
        console.log(
            CHESS_TYPE.WUZI,
            CHESS_TYPE.SIZI,
            CHESS_TYPE.SANZI_NOEND
        )
    }

    //调用该方法时，默认为电脑调用
    export function getSomeSteps(arr,step){
        let curArr = []
        for(let i = 0 ; i<step ; i++){
            for (let index = 2; index >0; index--) {

                curArr[i] = this.getBestPoint(arr,index)
            }

        }

    }


    /**
     * 该函数只计算单词落点的最优值
     * @param arr 传入棋盘落子信息
     * @param type 给棋子type的策略   
     */
    export function getBestPoint(arr,type){
        // this.getCurScore(arr,type)
        console.clear()
        let maxScore =null
        let pos

        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[0].length; j++) {

                if( arr[i][j]!= 9  || isEmptyAround(arr,i,j)   ){
                    // console.log("跳过了点",i,j)

                }else{
                    console.log("电脑落子拟",i,j)

                    this.saveArr = []

                    // let tryArr = arr.concat()
                    let tryArr = copyArr(arr)

                    tryArr[i][j] = type
                    let myScore =  this.getCurScore(tryArr,type)
                    let enemyScore = this.getCurScore(tryArr,1)

                    let curScore = myScore - enemyScore
                    console.log("myScore",myScore,"    enemyScore",enemyScore)

                    console.log("maxscore",maxScore,"    curscore",curScore)

                    if( maxScore == null && curScore!=0 || curScore>maxScore){
                        maxScore = curScore
                        pos = new cc.Vec2(i,j)

                    }

                }          
            }
            
        }

        console.error(maxScore)
        return pos    
    }

    //lineType 1：斜率为1的连接  2：斜率为-1的连接  3：横排连接  4：竖排连接
    export function getCurScore(arr,type){
        let score = [0]

        //遍历整个棋盘 15*15*3*3
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[0].length; j++) {

                //只计算当前类型棋子
                if(arr[i][j]==type){
                    let length = 1

                    //遍历8个方向
                    for (let l = -1; l <= 1; l++) {
                        for (let m = -1; m <= 1; m++) {
                            
                            let newScore = this.findLongestLine(arr,i,j,l,m,type,length,score)

                            if(newScore > score[0]){
                                console.error("score 更新了score",score)
                                score[0] = newScore
                            }

                            }
    
                        } 
                    }
                }    
                          
        }
        return score[0]

    }

    export function findLongestLine(arr,i,j,dirX,dirY,type,length,score){

        if(dirX == 0 && dirY == 0){
            // console.log("返回值为0")
            return 0
        }
        // console.log(arr[i+dirX] , arr[i+dirX][j+dirY]  , )
        if( arr[i+dirX] && arr[i+dirX][j+dirY]  &&  arr[i+dirX][j+dirY] == type ){
            length+=1
            // console.log("还未达到最大长度 继续寻找")
            this.findLongestLine(arr,i+dirX,j+dirY,dirX,dirY,type,length,score)     
        }else if(arr[i+dirX] && arr[i+dirX][j+dirY]  &&  arr[i+dirX][j+dirY] == 9){
            
            let flag = true
            for (let index = 0; index < this.saveArr.length; index++) {
        
                //判断改积分段起始点未被记录
                if( this.saveArr[index][0].x == i+dirX - dirX*(length-1) &&
                    this.saveArr[index][0].y == j+dirY - dirY*(length-1) &&
                    this.saveArr[index][1].x == i+dirX &&
                    this.saveArr[index][1].y == j+dirY )
                    {
                        flag = false

                    }
            }

            let beginPos = cc.v2(i+dirX - dirX*(length-1), j+dirY - dirY*(length-1) )
            let endPos = cc.v2(i+dirX,j+dirY)
            let data = [beginPos,endPos ]
            this.saveArr.push(data)

            //弃置分数为0的后续计算
            if(testScore[length%6] == 0 || !flag){
                return 0
            }


            // console.warn(type,"发现了一个长度为",length,"的排列,起点为",i+dirX - dirX*(length-1),j+dirY - dirY*(length-1) , "终点为",i+dirX,j+dirY,"得分",testScore[length%6])

            // if(flag){
            //     score[0] += testScore[length%6]
            //     console.error("score进行了加法",score)
            // }

            if(length == 2){
        
                //00_0
                if(  this.isAPointValueType( arr,i,j,dirX,dirY,2,type )   ){

                    if(this.isAPointValueType( arr,i,j,dirX,dirY,3,type )){
                        // 00_00 
                        score[0] += 10000   
                        console.log("+10000")  
                    }else{
                        
                         // 00_0x
                        if(this.isAPointValueType(arr,i,j,dirX,dirY,-3, type^3 ) ){
                            // x00_0x
                            score[0] += 0
                        }else{
                            //_00_0x
                            score[0] +=100
                            console.log("+100")  

                        }
                    }

                }else{
                    score[0] += 200
                }


            }else if(length == 3){
                // 000
                
                //x000
                if(this.isAPointValueType(arr,i,j,dirX,dirY,-3, type^3)){
                    //x000x x000_x
                    if(this.isAPointValueType(arr,i,j,dirX,dirY,1, type^3) || this.isAPointValueType(arr,i,j,dirX,dirY,2, type^3)  ){
                        score[0] += 0
                    }else if(this.isAPointValueType(arr,i,j,dirX,dirY,3, type^3)){
                        //x000__x
                        score[0] +=300
                        console.log("+300")  

                    }
                }else if(this.isAPointValueType(arr,i,j,dirX,dirY,2, type)){       
                    score[0] += 5000
                    console.log("+5000")  

                }else{
                    score[0] += 2000
                    console.log("+2000")  

                }
            }else if(length == 4){
                // 0000
                if( this.isAPointValueType(arr,i,j,dirX,dirY,-4, type^3) ){
                    score[0] += 1500
                }else{
                    score[0] += 20000
                }
            }else if(length == 5){
                console.error("出现5子了",type)
                score[0] += 199999
            }


        }else{
            // console.log("啥也不是")
        }
        
        return score

    }

    //判断一个点的八个方向是否都无落子
    export function isEmptyAround(arr,x,y){
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if( arr[x+i] && arr[x+i][y+j] &&  arr[x+i][y+j] !=0 && (i!=0||j!=0)  ){
                    console.log(x+i,y+j,"点有落子")
                    return false
                }        
            } 
        }
        return true
    }


    
 
    //传入数组，原点坐标，变化方向，类型，判断该点正确存在并且类型正确
    export function isAPointValueType(arr, i,j ,dirX,dirY, length, type ){
  
        if(arr[i+dirX*length] && arr[i+dirX*length][j+dirY*length] && arr[i+dirX*length][j+dirY*length] == type){
            return true
        }else{
            return false
        }
    }




    export function copyArr(arr){
        let result = []
        for (let i = 0; i < arr.length; i++) {
            result[i] = []
            for (let j = 0; j < arr[0].length; j++) {
                result[i][j] = arr[i][j]        
            }            
        }


        return result
    }

    //判断一个值非空且不为0 
    //卧槽 好蠢  
    export function notNullAndZero(num){
        if(num && num!=0){
            return true
        }else{
            return false
        }

    }

    

}

export {AI}