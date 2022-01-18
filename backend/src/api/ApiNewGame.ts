import { ApiCall } from "tsrpc";
import { GameRoom } from "../models/GameRoom";
import { chessType, ReqNewGame, ResNewGame } from "../shared/protocols/PtlNewGame";

export async function ApiNewGame(call: ApiCall<ReqNewGame, ResNewGame>) {
    // TODO
    // call.error('API Not Implemented');

    // call.succ({
    //     "code":200
    // })

    let data =  GameRoom.ins.addPlayer(call.conn)
    let type:chessType
    if(data.num == 1){
        type = chessType.black
    }else if(data.num == 2){
        type = chessType.white
    }else{
        type = chessType.look
    }
    call.succ({
        "code":200,
        "uid":data.uid,
        "chessType":type
    })
}