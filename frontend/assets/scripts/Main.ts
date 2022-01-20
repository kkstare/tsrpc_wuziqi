// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { actType, gameState } from "../src/shared/protocols/MsgGameData";
import { chessType } from "../src/shared/protocols/PtlNewGame";
import { AI } from "./AI";
import { MyData } from "./PlayerData";
import ServerClient from "./ServerClient";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Node)
    bg:cc.Node = null;

    @property(cc.Prefab)
    black:cc.Prefab = null;

    @property(cc.Prefab)
    white:cc.Prefab = null;

    @property(cc.Node)
    waitNode:cc.Node = null;

    @property(cc.Label)
    player1Name:cc.Label
    @property(cc.Label)
    player2Name:cc.Label

    @property(cc.Node)
    tipNode:cc.Node

    @property(cc.Prefab)
    preTip:cc.Prefab


    //用于记录棋盘上每个点分别是什么子
    private arrChess = [];

    //用于记录落子的顺序，存储坐标对象
    private arrPos = [];

    private gameState = gameState.wait
    private _nextChess: chessType;
    public get nextChess(): chessType {
        return this._nextChess;
    }
    public set nextChess(value: chessType) {
        this._nextChess = value;
        if(MyData.chessType == chessType.look){
            this.waitNode.active = false        
        }else if(this.nextChess == MyData.chessType){
            this.waitNode.active = false
        }else{
            this.waitNode.active = true
        }
    }

    async onLoad() {
        this.initListen()

        let res = this.getQueryVariable()
        this.initData()
        MyData.deskId = Math.random()<0.5?1:2
        console.error(res)
        MyData.deskId = 2

        if(res["uid"] && res["userName"]){
            MyData.uid = Number(res["uid"])
            MyData.userName = res["userName"]
            MyData.deskId =Number( res["deskId"] )

        }else{
            let id = Math.floor(Math.random()*1000)
            MyData.uid = id
            MyData.userName = "玩家"+id
        }
        


		await ServerClient.connect();
        let data = await (await ServerClient.beginNewGame()).res
        MyData.chessType = data.chessType
        this.nextChess = chessType.black

        cc.game.on("click",(pos)=>{
            if(this.gameState == gameState.over){
                this.showTip("游戏已结束")
                return
            }

            if(MyData.chessType == chessType.look){
                this.showTip("观棋不语")
                return
            }
            if(this.nextChess != MyData.chessType){
                this.showTip("现在是对方行动")
                return
            }

            //记录点击的格子存数组并判断后续点击
            let tiledPos = this.convertToTiledPos(pos)

            //该条件可用于判断落子是否在棋盘内
            let cenPos = this.convertToTrulyPos(tiledPos)

            if(!cenPos){
                console.log("点到屏幕外了")
            }else if(this.arrChess[tiledPos.x][tiledPos.y] != 9){
                // console.log("此处有落子")
                this.showTip("此处有落子")

            }else{

                ServerClient.playChess(tiledPos.x,tiledPos.y)

                // this.playToPos(tiledPos,MyData.chessType)

                console.log(this.arrChess)

            }
         
        })
    }
    getQueryVariable()
    {
        let data = []
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                data[pair[0]] = pair[1]
                
        }
        return data
    }
        
          
    initListen(){
        ServerClient.wslient.listenMsg("GameData",(res)=>{
            console.error(res.actType)
            switch (res.actType) {
                case actType.chessMove:
                    this.playToPos( cc.v2(res.chooseX,res.chooseY ),res.chessType)
                    this.nextChess = res.chessType==chessType.black?chessType.white:chessType.black
                    break
                case actType.playerAct:
                    console.log(res)
                    break
                case actType.userList:
                    this.player1Name.string = res.userList[0]?res.userList[0].userName:"虚位以待"
                    this.player2Name.string = res.userList[1]?res.userList[1].userName:"虚位以待"

                    if(res.userList[0]?.onLine == false){
                        this.player1Name.string = res.userList[0].userName+"(离线···)"
                    }
                    if(res.userList[1]?.onLine == false){
                        this.player2Name.string = res.userList[1].userName+"(离线···)"
                    }


                    if(res.userList[0]?.uid == MyData.uid){
                        this.player1Name.node.color = cc.color(0,200,0,255)
                    }
                    if(res.userList[1]?.uid == MyData.uid){
                        this.player2Name.node.color = cc.color(0,200,0,255)
                    }


                    break
                case actType.chessMap:
                    for(let i = 0 ; i< res.chessMap.length;i++){
                        for(let j = 0 ; j< res.chessMap[0].length;j++){
                            if(res.chessMap[i][j] == chessType.black){
                                this.playToPos( cc.v2(i,j ),chessType.black)
                            }else if(res.chessMap[i][j] == chessType.white){
                                this.playToPos( cc.v2(i,j ),chessType.white)
                            }else{
                                this.arrChess[i][j] = 9
                            }
                        }
                    }
                    break
                case actType.gameState:
                    if(res.gameState == gameState.over){
                        this.gameState = gameState.over
                        this.showTip( (res.winer == chessType.black ?"黑子":"白子") + "取得胜利" )
                    }
                    break
                case actType.tipMsg:
                    this.showTip(res.msg)
                    break
                default:
                    console.error("暂未实现")

            }

        })
    }
    initData(){
        for(let i=0;i<15;i++){
            this.arrChess[i]=[]
            for (let j = 0; j < 15; j++) {
                this.arrChess[i][j]=9
            }
        }
        
        let beginPos = 26
        let width = 42
        for (let i = 0; i < 30; i++) {
                let textNode = new cc.Node()
                textNode.addComponent(cc.Label)
                textNode.getComponent(cc.Label).fontSize = 20
                textNode.color = cc.color(255,0,0,255)
                if(i<15){
                    textNode.getComponent(cc.Label).string = i.toString()
                    textNode.x = 10
                    textNode.y = 13+ i*width
                }else{
                    let j = i-15
                    textNode.getComponent(cc.Label).string = j.toString()
                    textNode.y = 620
                    textNode.x = beginPos + j*width
                }

                
                textNode.parent = this.bg
            
        }

    }

    start () {
  
    }

    playToPos(tiledPos,type){
        let cenPos = this.convertToTrulyPos(tiledPos)

        this.arrChess[tiledPos.x][tiledPos.y] = type
        this.arrPos.push(cc.v2(tiledPos.x,tiledPos.y) )
        
        let newObj
        if( type == chessType.black ){
            newObj = cc.instantiate(this.black)
        }else{
            newObj = cc.instantiate(this.white)
            
        }   

        cc.game.emit("hide_check")
        cc.game.on("hide_check",()=>{
            newObj.getChildByName("check").active = false
        })


        newObj.position = cenPos
        newObj.parent = this.bg


        // this.changeRound()
    }


    //位置坐标 26->614  宽度 42
    /**
     * 
     * @param pos 
     * 将点击坐标转换为棋盘格子坐标，左下角为(0,0)点
     */
    convertToTiledPos(pos){
        let beginPos = 26
        let width = 42

        let x =  Math.round((pos.x-beginPos)/width)  
        let y =  Math.round((pos.y-beginPos)/width) 

        return new cc.Vec2(x,y)
    }

    /**
     * 
     * @param pos 
     * 将格子坐标转换为棋盘落子位置坐标
     */
    convertToTrulyPos(pos){
        let beginPos = 26
        let width = 42
        let x = beginPos + pos.x*width
        let y = beginPos + pos.y*width

        let newV3 = new cc.Vec3(x,y,1)

        if(x<0 || y<0){
            return null
        }else{
            return newV3
        }

    }


    judgeIsGameOver(){
        

    }


    //将点击坐标直接转换为中心坐标，暂时没用上
    convertToCenter(pos){
        let tiledPos = this.convertToTiledPos(pos)
        let result = this.convertToTrulyPos(tiledPos)

        let newV3 = new cc.Vec3(result.x,result.y,1)

        if(result.x<0 || result.y<0){
            return null
        }else{
            return newV3
        }
    }

    showTip(text:string){
        let tip = cc.instantiate(this.preTip)
        tip.parent = this.tipNode
        tip.getChildByName("label").getComponent(cc.Label).string = text
        cc.tween(tip)
        .delay(0.5)
        .by(2,{y:200,opacity:-255})
        .call(()=>{
            tip.destroy()
        })
        .start()


    }


    // update (dt) {}
}
