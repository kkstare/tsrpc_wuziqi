import { ApiCall } from "tsrpc";
import { GameRoom } from "../models/GameRoom";
import RoomMgr from "../models/RoomMgr";
import { actType, MsgGameData } from "../shared/protocols/MsgGameData";
import { chessType, playerData, ReqNewGame, ResNewGame } from "../shared/protocols/PtlNewGame";

export async function ApiNewGame(call: ApiCall<ReqNewGame, ResNewGame>) {

    let room = RoomMgr.ins.getRoomById(call.req.deskId)

    let data = room.addPlayer(call.conn,call.req)
    
    let type:chessType
    if(data.num == 1){
        type = chessType.black
    }else if(data.num == 2){
        type = chessType.white
    }else{
        type = chessType.look
    }
    room.broadUserData()

    let chessData:MsgGameData={
        "actType":actType.chessMap,
        "chessMap": room.chessMap
        
    }
    call.conn.sendMsg("GameData",chessData)

    call.succ({
        "code":200,
        "uid":data.uid,
        "chessType":type,
    })
}