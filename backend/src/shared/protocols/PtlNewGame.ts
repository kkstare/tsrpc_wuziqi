import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqNewGame extends BaseRequest {
    uid:number,
    userName:string
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
}

export enum chessType{
    white=1,
    black=2,
    look=3
}
