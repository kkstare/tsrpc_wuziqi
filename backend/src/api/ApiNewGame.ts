import { ApiCall } from "tsrpc";
import { GameRoom } from "../models/GameRoom";
import { actData, actType, MsgGameData } from "../shared/protocols/MsgGameData";
import { chessType, playerData, ReqNewGame, ResNewGame } from "../shared/protocols/PtlNewGame";

export async function ApiNewGame(call: ApiCall<ReqNewGame, ResNewGame>) {
    // TODO
    // call.error('API Not Implemented');

    // call.succ({
    //     "code":200
    // })
    
    let data =  GameRoom.ins.addPlayer(call.conn,call.req)
    let type:chessType
    if(data.num == 1){
        type = chessType.black
    }else if(data.num == 2){
        type = chessType.white
    }else{
        type = chessType.look
    }
    GameRoom.ins.broadUserData()

    let chessData:MsgGameData={
        "type":actType.chessMap,
        "data":{
            "actType":actType.chessMap,
            "chessMap": GameRoom.ins.chessMap
        }
    }
    call.conn.sendMsg("GameData",chessData)

    call.succ({
        "code":200,
        "uid":data.uid,
        "chessType":type,
    })
}