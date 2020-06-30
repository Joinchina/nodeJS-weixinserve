import axios from 'axios'
class create_menu {
    constructor(accessToken ){
        this.token=accessToken;
        this.prefix = 'https://api.weixin.qq.com/cgi-bin/' 
    };
    async create(){
        let url = this.prefix + 'menu/create?access_token=' + this.token;
        const menu = {
            "button":[
                {
                    "type":"view",
                    "name":"今日歌曲",
                    "url":"http://music.taihe.com/"
                },
                {
                    "name":"菜单",
                    "sub_button":[
                    {
                        "type":"view",
                        "name":"搜索",
                        "url":"http://www.baidu.com/"
                    },
                    {
                        "type":"view",
                        "name":"首页",
                        "url":"http://127.0.0.1:7001/newHealthHomePage"
                    }]
                }
            ]
        }
        const response = await axios.post(url, menu)
        console.log(response)        
        if(response.data.errcode===0){
            return response.data
        }else{
            return '失败'
        }
    }
}
export default create_menu