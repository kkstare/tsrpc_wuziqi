import { WsConnection } from "tsrpc";
import { server } from "..";
import { actType, MsgGameData, peopleActType } from "../shared/protocols/MsgGameData";
import { ServiceType } from "../shared/protocols/serviceProto";
import { GameRoom } from "./GameRoom";

export default class RoomMgr{
  private static _ins: RoomMgr;
  public static get ins(): RoomMgr {
    if (!RoomMgr._ins) {
       RoomMgr._ins = new RoomMgr()
    }
    return RoomMgr._ins;
  }
  public static set ins(value: RoomMgr) {
    RoomMgr._ins = value;
  }

  private rooms:GameRoom[] = []

  init() {  
    server.flows.postDisconnectFlow.push(v => {
        let conn = v.conn as WsConnection<ServiceType>;
        let room = this.getRoomById(conn.deskId)
        room.offLine(conn)   

        if ((room.players.length == 1 && room.players[0].onLine == false)||(room.players[0].onLine == false && room.players[1].onLine == false) ) {
          this.rooms[conn.deskId] = new GameRoom()
        }
			return v;
		});

    server.listenMsg("GameData",(data)=>{
      let room = this.getRoomById(data.conn.deskId)
      room.listenMsg(data) 
    })
  }

  getRoomById(deskId: number) {
    if (!this.rooms[deskId]) {
      this.rooms[deskId] = new GameRoom()
    }
    return this.rooms[deskId]

  }


}