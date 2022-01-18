import { BaseWsClient } from 'tsrpc-base-client';

import { WsClient as WsClientBrowser } from 'tsrpc-browser';
import { actType } from '../src/shared/protocols/MsgGameData';
import { playerData,chessType } from '../src/shared/protocols/PtlNewGame';
import { serviceProto, ServiceType } from '../src/shared/protocols/serviceProto';
import Config from './Config';
import { MyData } from './PlayerData';

/**重连时间（ms） */
const MaxReconnectTime = 1000;

class ServerClient {


    private _wsClient!: BaseWsClient<ServiceType>;
    private _ssoToken: string | undefined;

    constructor() {
        
    }

    get wslient() {
        if (!this._wsClient) {
            this._wsClient = new (WsClientBrowser)(serviceProto, {
                server: Config.ServerUrl,
                logger: console,
                // json: true
            });
            
            let isDisconnect = false;
            // When disconnected
            this._wsClient.flows.postDisconnectFlow.push(v => {
                // Retry after 2 seconds
                isDisconnect = true;
                this.connect();
                setTimeout(() => {
                    if (this._wsClient.isConnected) {
                        return;
                    }
                    this.connect();
                }, MaxReconnectTime);
                return v;
            })     
        }
        return this._wsClient;
    }

    async connect(): Promise<void> {
        if (!this.wslient) {
            return;
        }
        let res = await this.wslient.connect();
        if (!res.isSucc) {
            // Retry after 2 seconds
            await new Promise(rs => { setTimeout(rs, MaxReconnectTime) });
            await this.connect();
        }
    }


    async beginNewGame(){
        let p1:playerData={
            "uid":1,
            "userName":"玩家1",
            "chessType":chessType.white
        }
        let p2:playerData={
            "uid":3,
            "userName":"玩家3",
            "chessType":chessType.black
        }

        let res = await this.wslient.callApi("NewGame",{
            "player1Data":p1,
            "player2Data":p2
        })
        return res
    }

    async playChess(x,y){

        this.wslient.sendMsg("GameData",{
            "type":actType.nomalMove,
            "data":{
                "uid":MyData.uid,
                "chessType":MyData.chessType,
                "chooseX":x,
                "chooseY":y
            }
        }) 
       
    }



    
}

export default new ServerClient();