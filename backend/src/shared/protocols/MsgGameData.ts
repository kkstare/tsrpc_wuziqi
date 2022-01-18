import { chessType } from "./PtlNewGame";

export interface MsgGameData {
    type:actType
    data:actData
}

export enum actType{
    nomalMove = 1,
    chatMsg=2,  
    newPlayerIn=3
}

export interface actData{
    uid:number,
    chessType:chessType,
    chooseX:number,
    chooseY:number
}


// export const conf = {}