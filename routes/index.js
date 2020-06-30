const router = require('koa-router')()
const getRawBody = require('raw-body');
import {reply,parseXML,check} from '../base/chat';
import {chatgo} from '../base/chatgo';
//处理微信的连接请求
router.get('/', async (ctx, next) => {
  const getctx=check(ctx,next);
  ctx.body=getctx
});
//处理微信的消息
router.post('/', async (ctx, next) => {
  const getctx=check(ctx,next);
  // 取原始数据
  const xml = await getRawBody(getctx.req, {
    length: ctx.request.length,
    limit: '1mb',
    encoding: ctx.request.charset || 'utf-8'
  })
  const formatted = await parseXML(xml)
  const content=chatgo(formatted)
  const replyMessageXml = reply(content, formatted.ToUserName, formatted.FromUserName)
  ctx.type = 'application/xml'
  return ctx.body = replyMessageXml
})
module.exports = router
