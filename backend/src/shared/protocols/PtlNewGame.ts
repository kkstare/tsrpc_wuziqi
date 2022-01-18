import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqNewGame extends BaseRequest {
    player1Data:playerData
    player2Data:playerData 
}

export interface ResNewGame extends BaseResponse {
    code:number
    uid:number
    chessType:chessType
}

export const conf: BaseConf = {
    
}

export interface playerData{
    uid:number,
    userName:string
    chessType:chessType
}

export enum chessType{
    white=1,
    black=2,
    look=3
}
