import { BaseConnection, HttpClient, MsgCall, WsConnection } from "tsrpc";
import { server } from "..";
import { actType, gameState, MsgGameData, peopleActType } from "../shared/protocols/MsgGameData";
import { chessType, playerData, ReqNewGame } from "../shared/protocols/PtlNewGame";
import { ServiceType } from "../shared/protocols/serviceProto";


export class GameRoom{


    private gameState = gameState.wait

    public players:BaseConnection[] = []
    public chessMap: chessType[][] = []
    
    constructor() {
        
        this.init()
    }

    addPlayer(conn: BaseConnection,req:ReqNewGame){
        conn.uid = req.uid
        conn.userName = req.userName
        conn.deskId = req.deskId
        conn.onLine = true
        // if(this.players.length == 0){
        //     GameRoom.init()
        // }
        if(this.players[0]?.uid == conn.uid){
            this.players[0] = conn
        }else if(this.players[1]?.uid == conn.uid){
            this.players[1] = conn
        }else{
            this.players.push(conn)
        }
        
        console.log("this.rooms")
        
        return {uid:Number(conn.uid),num:this.players.length  }
    }

    init(){
        this.gameState = gameState.wait
        for (let index = 0; index < 15; index++) {
            this.chessMap[index] = []
            for (let j = 0; j < 15; j++) {
                this.chessMap[index][j] = chessType.look
            } 
        }

    }
    listenMsg(data: MsgCall<MsgGameData, any>) {
        if (data.msg.actType == actType.chessMove) { 
            if (this.players.length < 2) {
                let tipData: MsgGameData = {
                    "actType": actType.tipMsg,
                    "msg":"等待其他玩家就绪"
                }
                server.broadcastMsg("GameData",tipData,this.players  as WsConnection[] )
                return
            }
            this.chessMap[data.msg.chooseX][data.msg.chooseY] = data.msg.chessType

            this.checkWin()
    
            server.broadcastMsg("GameData",data.msg,this.players  as WsConnection[] )
        }
   
    }
    checkWin() {
        let res = this.checkGameOver()
        if(res != chessType.look){
            let winData:MsgGameData={
                "actType":actType.gameState,
                "winer":res,
                "gameState":gameState.over
                
            }
            this.gameState = gameState.over
            this.init()

            server.broadcastMsg("GameData",winData,this.players  as WsConnection[] )
        } 
    }

    offLine(conn:BaseConnection) {
        let data:MsgGameData={
            "actType":actType.playerAct,
            "uid":0,
            "userName":"",
            "type":peopleActType.out
        }
        server.broadcastMsg("GameData",data,this.players  as WsConnection[] )
        if (conn.uid) {
          for (let index = 0; index < this.players.length; index++) {
              if(conn.uid == this.players[index].uid){
                  if (index < 2) {
                      this.players[index].onLine = false

                  } else {
                    this.players.splice(index,1)                
                  }
              }   
          }
        }   
        this.broadUserData()

    }
    checkGameOver(){
        for (let i = 0; i < this.chessMap.length; i++) {
            for (let j = 0; j < this.chessMap[0].length; j++) {
                if(this.chessMap[i][j] == chessType.look){
                    continue
                }
                let dir = [ [0,1],[1,0],[1,1],[1,-1]]
                let curType = this.chessMap[i][j]
                for (let k = 0; k < dir.length; k++) {
                    let curLength = 0
                    for (let l = 0; l < 10; l++) {
                        if(this.chessMap[i+l*dir[k][0]]?.[j+l*dir[k][1]] == curType ){
                            curLength++
                        }else{
                            l = 10
                        }    
                    }
                    if(curLength >= 5){
                        return curType
                    }
                 
                }
            }     
        }

        return chessType.look
    }

    sendChessData(){

    }

    broadUserData(){
        let res = []
        for (let index = 0; index < this.players.length; index++) {
            const element = this.players[index];
            let data:playerData = {
                uid:element.uid,
                userName: element.userName,
                onLine:element.onLine
            }
            res.push(data)
        }
        let data:MsgGameData={
            "actType":actType.userList,
            "userList":res 
        }
        server.broadcastMsg("GameData",data,this.players  as WsConnection[] )
    }


    

    


}

