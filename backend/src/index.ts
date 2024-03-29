import * as path from "path";
import { WsServer } from "tsrpc";
import { GameRoom } from "./models/GameRoom";
import RoomMgr from "./models/RoomMgr";
import { serviceProto } from './shared/protocols/serviceProto';
declare module 'tsrpc' {

    export interface BaseConnection {
        uid: number;
        userName: string,
        deskId: number,
        onLine:boolean
    }
}
// Create the Server
export const server = new WsServer(serviceProto, {
    port: 3001,
    // Remove this to use binary mode (remove from the client too)
    json: true
});

// Initialize before server start
async function init() {
    await server.autoImplementApi(path.resolve(__dirname, 'api'));
    await RoomMgr.ins.init()
};

// Entry function
async function main() {
    await init();
    await server.start();
    // await GameRoom.init()
}
main();