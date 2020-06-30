import axios from 'axios'
const fs = require('fs-extra')
class access_token {
    constructor(appid, appsecret) {
        this.appid = appid
        this.appsecret = appsecret
        this.prefix = 'https://api.weixin.qq.com/cgi-bin/'
        // 保存access_token
        this.saveToken = async function (token) {
            await fs.writeFile('access_token.txt', JSON.stringify(token))
        }
        // 从文件获取读取数据
        this.getToken = async function () {
            const txt = await fs.readFile('access_token.txt', 'utf8')
            return JSON.parse(txt)
        }
    }
    async getAccessToken() {
        let token={};
        const response = await axios.get(
            `${this.prefix}token?grant_type=client_credential&appid=${this.appid}&secret=${this.appsecret}`
        );
        let data=response.data
        // 过期时间，因网络延迟等，将实际过期时间提前20秒，以防止临界点
        const expireTime = Date.now() + (data.expires_in - 20) * 1000
        token.accessToken = data.access_token
        token.expireTime = expireTime
        await this.saveToken(token)
        return token
    }
    // 读取文件获取token，读取失败重新请求接口
    async ensureAccessToken() {
        let token = {}
        try {
            token = await this.getToken()
        } catch (e) {
            token = await this.getAccessToken()
        }
        if(token && (this.isValid(token.accessToken, token.expireTime))) {
            return token
        }
        return this.getAccessToken()
    }
    // 验证access_token是否过期
    isValid(accessToken, expireTime) {
        return !!accessToken && Date.now() < expireTime
    }
}
const accessToken =new access_token('wx63c280128fc571d4','2ca8335ad233728bea946aaf69625367')
export default accessToken
