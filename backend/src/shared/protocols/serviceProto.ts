import { ServiceProto } from 'tsrpc-proto';
import { MsgGameData } from './MsgGameData';
import { ReqNewGame, ResNewGame } from './PtlNewGame';

export interface ServiceType {
    api: {
        "NewGame": {
            req: ReqNewGame,
            res: ResNewGame
        }
    },
    msg: {
        "GameData": MsgGameData
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 2,
    "services": [
        {
            "id": 2,
            "name": "GameData",
            "type": "msg"
        },
        {
            "id": 3,
            "name": "NewGame",
            "type": "api",
            "conf": {}
        }
    ],
    "types": {
        "MsgGameData/MsgGameData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "type",
                    "type": {
                        "type": "Reference",
                        "target": "MsgGameData/actType"
                    }
                },
                {
                    "id": 1,
                    "name": "data",
                    "type": {
                        "type": "Reference",
                        "target": "MsgGameData/actData"
                    }
                }
            ]
        },
        "MsgGameData/actType": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 1
                },
                {
                    "id": 1,
                    "value": 2
                },
                {
                    "id": 2,
                    "value": 3
                }
            ]
        },
        "MsgGameData/actData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "chessType",
                    "type": {
                        "type": "Reference",
                        "target": "PtlNewGame/chessType"
                    }
                },
                {
                    "id": 4,
                    "name": "chooseX",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "chooseY",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "PtlNewGame/chessType": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 1
                },
                {
                    "id": 1,
                    "value": 2
                },
                {
                    "id": 2,
                    "value": 3
                }
            ]
        },
        "PtlNewGame/ReqNewGame": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "player1Data",
                    "type": {
                        "type": "Reference",
                        "target": "PtlNewGame/playerData"
                    }
                },
                {
                    "id": 1,
                    "name": "player2Data",
                    "type": {
                        "type": "Reference",
                        "target": "PtlNewGame/playerData"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface"
        },
        "PtlNewGame/playerData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "userName",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "chessType",
                    "type": {
                        "type": "Reference",
                        "target": "PtlNewGame/chessType"
                    }
                }
            ]
        },
        "PtlNewGame/ResNewGame": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "code",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "chessType",
                    "type": {
                        "type": "Reference",
                        "target": "PtlNewGame/chessType"
                    }
                }
            ]
        },
        "base/BaseResponse": {
            "type": "Interface"
        }
    }
};