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
    "version": 5,
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
                },
                {
                    "id": 3,
                    "value": 4
                },
                {
                    "id": 4,
                    "value": 5
                },
                {
                    "id": 5,
                    "value": 6
                }
            ]
        },
        "MsgGameData/actData": {
            "type": "Union",
            "members": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "MsgGameData/chessData"
                    }
                },
                {
                    "id": 1,
                    "type": {
                        "type": "Reference",
                        "target": "MsgGameData/peopleData"
                    }
                },
                {
                    "id": 2,
                    "type": {
                        "type": "Reference",
                        "target": "MsgGameData/userData"
                    }
                },
                {
                    "id": 3,
                    "type": {
                        "type": "Reference",
                        "target": "MsgGameData/mapData"
                    }
                },
                {
                    "id": 4,
                    "type": {
                        "type": "Reference",
                        "target": "MsgGameData/gameData"
                    }
                }
            ]
        },
        "MsgGameData/chessData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 4,
                    "name": "actType",
                    "type": {
                        "type": "Literal",
                        "literal": 1
                    }
                },
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "chessType",
                    "type": {
                        "type": "Reference",
                        "target": "PtlNewGame/chessType"
                    }
                },
                {
                    "id": 2,
                    "name": "chooseX",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
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
        "MsgGameData/peopleData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 3,
                    "name": "actType",
                    "type": {
                        "type": "Literal",
                        "literal": 3
                    }
                },
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
                    "name": "type",
                    "type": {
                        "type": "Reference",
                        "target": "MsgGameData/peopleActType"
                    }
                }
            ]
        },
        "MsgGameData/peopleActType": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 1
                },
                {
                    "id": 1,
                    "value": 2
                }
            ]
        },
        "MsgGameData/userData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "actType",
                    "type": {
                        "type": "Literal",
                        "literal": 4
                    }
                },
                {
                    "id": 1,
                    "name": "userList",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "PtlNewGame/playerData"
                        }
                    }
                }
            ]
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
                }
            ]
        },
        "MsgGameData/mapData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "actType",
                    "type": {
                        "type": "Literal",
                        "literal": 5
                    }
                },
                {
                    "id": 1,
                    "name": "chessMap",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Array",
                            "elementType": {
                                "type": "Reference",
                                "target": "PtlNewGame/chessType"
                            }
                        }
                    }
                }
            ]
        },
        "MsgGameData/gameData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "actType",
                    "type": {
                        "type": "Literal",
                        "literal": 6
                    }
                },
                {
                    "id": 1,
                    "name": "gameState",
                    "type": {
                        "type": "Reference",
                        "target": "MsgGameData/gameState"
                    }
                },
                {
                    "id": 2,
                    "name": "winer",
                    "type": {
                        "type": "Reference",
                        "target": "PtlNewGame/chessType"
                    }
                }
            ]
        },
        "MsgGameData/gameState": {
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
                    "id": 2,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "userName",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface"
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