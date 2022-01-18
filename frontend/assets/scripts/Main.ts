// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { checkPrime } from "crypto";
import { actType } from "../src/shared/protocols/MsgGameData";
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

    //用于记录棋盘上每个点分别是什么子
    private arrChess = [];

    //用于记录落子的顺序，存储坐标对象
    private arrPos = [];
    
    private _nextChess: chessType;
    public get nextChess(): chessType {
        return this._nextChess;
    }
    public set nextChess(value: chessType) {
        this._nextChess = value;
        if(this.nextChess == MyData.chessType){
            this.waitNode.active = false
        }else{
            this.waitNode.active = true
        }
    }
    async onLoad () {
        this.initData()

        MyData.uid = 1
        MyData.userName = "玩家"+Math.floor(Math.random()*100 )

		await ServerClient.connect();

        let data = await (await ServerClient.beginNewGame()).res
        MyData.uid = data.uid,
        MyData.chessType = data.chessType
        console.error(MyData.chessType)
        this.nextChess = chessType.black
        this.initListen()
        console.log("onload ==== ")

        cc.game.on("click",(pos)=>{
            console.log("click")
            if(MyData.chessType == chessType.look){
                console.log("观棋不语")
                return
            }
            if(this.nextChess != MyData.chessType){
                console.error("现在是对方行动")
                return
            }

            //记录点击的格子存数组并判断后续点击
            let tiledPos = this.convertToTiledPos(pos)

            //该条件可用于判断落子是否在棋盘内
            let cenPos = this.convertToTrulyPos(tiledPos)

            if(!cenPos){
                console.log("点到屏幕外了")
            }else if(this.arrChess[tiledPos.x][tiledPos.y] != 9){
                console.log("此处有落子")
            }else{

                ServerClient.playChess(tiledPos.x,tiledPos.y)

                // this.playToPos(tiledPos,MyData.chessType)

                console.log(this.arrChess)

            }
         
        })
    }

    initListen(){
        ServerClient.wslient.listenMsg("GameData",(res)=>{
            // data.type
            // console.log(data)
            let type = res.type
            switch(type){
                case actType.nomalMove:
                    this.playToPos( cc.v2(res.data.chooseX,res.data.chooseY ),res.data.chessType)
                    this.nextChess = res.data.chessType==chessType.black?chessType.white:chessType.black
        

                break
                case actType.chatMsg:
                break
                case actType.newPlayerIn:
                break
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
        
        console.log( type==1?"白子":"黑子","落子",tiledPos.x,tiledPos.y)
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


        this.changeRound()
    }

    changeRound(){
        if(this.arrPos.length%2==1 ){

            console.log("现在是电脑移动")
            // this.waitNode.active = true
            this.scheduleOnce(()=>{
            },1)


        }else{
            // this.waitNode.active = false
            console.log("现在是玩家移动")
        }   
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

        console.log("点击了第",x,"行,第",y,"列")

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
        console.log("转换为了坐标X：",x,"Y：",y)

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


    // update (dt) {}
}
