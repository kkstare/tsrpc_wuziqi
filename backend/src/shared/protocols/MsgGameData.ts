import { chessType, playerData } from "./PtlNewGame";
export enum actType{
    chessMove = 1,
    chatMsg=2,  
    playerAct=3,
    userList=4,
    chessMap = 5,
    gameState = 6,
}
export interface MsgGameData {
    type:actType
    data:actData
}

export type actData = chessData|peopleData|userData|mapData|gameData

export interface chessData{
    actType:1,
    uid:number,
    chessType:chessType,
    chooseX:number,
    chooseY:number
}
export interface peopleData{
    actType:3,
    uid:number,
    userName:string,
    type:peopleActType
}
export interface userData{
    actType:4,
    userList:playerData[]
}
export interface mapData{
    actType:5
    chessMap:chessType[][]
}
export interface gameData{
    actType:6
    gameState:gameState
    winer:chessType
}

export enum gameState{
    wait = 1,
    game = 2,
    over = 3
}


export enum peopleActType{
    in = 1,
    out = 2
}


// export const conf = {}