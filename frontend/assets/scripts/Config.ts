
enum EServerType {
    Local,
    Test,
    Online,
    Temp,
}

/**全局配置 */
export const GlobalCf = {
    Version: '1.0.0',
    IsLocalCf: true,
    ServerType: EServerType.Temp,
    ServerUrl: [
        'ws://localhost:3001',
        'wss://api-test.aigamify.cn/aiword',
        'wss://aiword.aigamify.cn',
        'wss://106.53.94.70:3001'
    ],
}

interface IGlobalCf {
    /**服务器url */
    serverUrl: string,

}

/**游戏配置全局类 */
class Config {

    get ServerUrl() {
        return GlobalCf.ServerUrl[GlobalCf.ServerType];
    }

    /**是否在test环境 */
    isInTest() {
        return true;
    }
}

export default new Config();