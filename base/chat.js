// const ejs = require('ejs');
// import ejs from 'ejs'
const ejs =require('ejs')
const parseString = require('xml2js').parseString;
const sha1 = require('node-sha1');
const tpl = `<xml>
  <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>
  <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>
  <CreateTime><%=createTime%></CreateTime>
  <MsgType><![CDATA[<%=msgType%>]]></MsgType>
  <% if (msgType === 'news') { %>
  <ArticleCount><%=content.length%></ArticleCount>
  <Articles>
  <% content.forEach(function(item){ %>
  <item>
  <Title><![CDATA[<%-item.title%>]]></Title>
  <Description><![CDATA[<%-item.description%>]]></Description>
  <PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic || item.thumb_url %>]]></PicUrl>
  <Url><![CDATA[<%-item.url%>]]></Url>
  </item>
  <% }) %>
  </Articles>
  <% } else if (msgType === 'music') { %>
  <Music>
  <Title><![CDATA[<%-content.title%>]]></Title>
  <Description><![CDATA[<%-content.description%>]]></Description>
  <MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>
  <HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>
  </Music>
  <% } else if (msgType === 'voice') { %>
  <Voice>
  <MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>
  </Voice>
  <% } else if (msgType === 'image') { %>
  <Image>
  <MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>
  </Image>
  <% } else if (msgType === 'video') { %>
  <Video>
  <MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>
  <ThumbMediaId><![CDATA[<%-content.thumbMediaId%>]]></ThumbMediaId>  
  <Title><![CDATA[<%-content.title%>]]></Title>
  <Description><![CDATA[<%-content.description%>]]></Description>
  </Video>
  <% } else { %>
  <Content><![CDATA[<%-content%>]]></Content>
  <% } %>
</xml>`;
// ejs编译
const compiled = ejs.compile(tpl)
/**
 * 消息回复
 * @param {string || object} content 回复的内容：字符串或者对象
 * @param {string} fromUsername 
 * @param {string} toUsername 
 */
function reply(content, fromUsername, toUsername) {
  var info = {}
  var type = 'text'
  info.content = content || ''
  if (Array.isArray(content)) {
    type = 'news'
  } else if (typeof content === 'object') {
    if (content.hasOwnProperty('type')) {
      type = content.type
      info.content = content.content
    } else {
      type = 'music'
    }
  }
  info.msgType = type
  info.createTime = new Date().getTime()
  info.toUsername = toUsername
  info.fromUsername = fromUsername
  return compiled(info)
};

/**
* xml转json
* @param {xml} xml
* @returns {Promise}
*/
function parseXML(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, { trim: true, explicitArray: false, ignoreAttrs: true }, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result.xml)
    })
  })
}
function check(ctx,next){
  let request = ctx.request;
  let req_query = request.query;
  var token = "xkghlmn";
  var signature = req_query.signature;
  var timestamp = req_query.timestamp;
  var echostr = req_query.echostr;
  var nonce = req_query.nonce;

  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = token;
  oriArray.sort();
  var original = oriArray.join('');
  var sha = sha1(original);
  if (signature === sha) {
      //验证成功
      if(ctx.method==='GET'){
        return echostr
      }else{
        return ctx
      }

  } else {
      //验证失败
      return ctx.body={ "message": "error" }
  }
}
export {
    reply,
    parseXML,
    check
}