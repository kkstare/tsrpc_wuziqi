import { BaseConnection, WsConnection } from "tsrpc";
import { server } from "..";
import { MsgGameData } from "../shared/protocols/MsgGameData";
import { chessType, playerData } from "../shared/protocols/PtlNewGame";


export class GameRoom{
    // static room = []
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

    public rooms:BaseConnection[] = []
    addPlayer(conn: BaseConnection){
        this.rooms.push(conn)
        return {uid:Number(conn.id),num:this.rooms.length }
    }

    static init(){

        server.listenMsg("GameData",(data)=>{
            server.broadcastMsg("GameData",data.msg,this.ins.rooms  as WsConnection[] )
        })
    }



}

