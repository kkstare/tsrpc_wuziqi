import { BaseConnection, HttpClient, WsConnection } from "tsrpc";
import { server } from "..";
import { actData, actType, gameState, MsgGameData, peopleActType } from "../shared/protocols/MsgGameData";
import { chessType, playerData, ReqNewGame } from "../shared/protocols/PtlNewGame";
import { ServiceType } from "../shared/protocols/serviceProto";


export class GameRoom{
    private static _ins: GameRoom;
    public static get ins(): GameRoom {
        if(!GameRoom._ins){
            GameRoom._ins = new GameRoom()
        }
        return GameRoom._ins;
    }
    public static set ins(value: GameRoom) {
        GameRoom._ins = value;
    }

    private gameState = gameState.wait

    public rooms:BaseConnection[] = []
    public chessMap:chessType[][] = []
    addPlayer(conn: BaseConnection,req:ReqNewGame){
        conn.uid = req.uid
        conn.userName = req.userName
        if(this.rooms.length == 0){
            GameRoom.init()
        }
        this.rooms.push(conn)
        console.log("this.rooms")
        
        return {uid:Number(conn.uid),num:this.rooms.length  }
    }

    static init(){
        GameRoom.ins.gameState = gameState.wait
        for (let index = 0; index < 15; index++) {
            GameRoom.ins.chessMap[index] = []
            for (let j = 0; j < 15; j++) {
                GameRoom.ins.chessMap[index][j] = chessType.look
            } 
        }
        server.flows.postDisconnectFlow.push(v => {
			let conn = v.conn as WsConnection<ServiceType>;
			conn.logger.log('断开连接');
            let data:MsgGameData={
                "type":actType.playerAct,
                "data":{
                    "actType":actType.playerAct,
                    "uid":0,
                    "userName":"",
                    "type":peopleActType.out
                }
            }
            server.broadcastMsg("GameData",data,this.ins.rooms  as WsConnection[] )

            let delIndex = 0
			if (conn.id) {
                for (let index = 0; index < GameRoom.ins.rooms.length; index++) {
                    if(conn.id == GameRoom.ins.rooms[index].id){
                        delIndex = index

                        GameRoom.ins.rooms.splice(index,1)
                        
                    }   
                }
			}

            GameRoom.ins.broadUserData()
            
			return v;
		});

        server.listenMsg("GameData",(data)=>{
            // if(GameRoom.ins.player1 == null || GameRoom.ins.player2 == null  ){
            //     return
            // }
            if(data.msg.data.actType == actType.chessMove){ 
                GameRoom.ins.chessMap[data.msg.data.chooseX][data.msg.data.chooseY] = data.msg.data.chessType
            }
            let res = GameRoom.ins.checkGameOver()

            if(res != chessType.look){
                let winData:MsgGameData={
                    "type":actType.gameState,
                    "data":{
                        "actType":actType.gameState,
                        "winer":res,
                        "gameState":gameState.over
                    }
                }
                GameRoom.ins.gameState = gameState.over
                this.init()

                server.broadcastMsg("GameData",winData,this.ins.rooms  as WsConnection[] )
            }

            server.broadcastMsg("GameData",data.msg,this.ins.rooms  as WsConnection[] )
        })

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
        for (let index = 0; index < this.rooms.length; index++) {
            const element = this.rooms[index];
            let data:playerData = {
                uid:element.uid,
                userName:element.userName
            }
            res.push(data)
        }
        let data:MsgGameData={
            "type":actType.userList,
            "data":{
                "actType":actType.userList,
                "userList":res
            }
        }
        server.broadcastMsg("GameData",data,this.rooms  as WsConnection[] )
    }



    


}

