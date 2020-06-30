function chatgo(formatted){
    let content = ''
    if (formatted.MsgType === 'event' && formatted.Event === 'subscribe'){
        content = '感谢您关注'
    } else if (formatted.Content === '音乐') {
        content = {
        type: 'music',
        content: {
            title: 'Lemon Tree',
            description: 'Lemon Tree',
            musicUrl: 'http://mp3.com/xx.mp3',
        },
        }
    } else if (formatted.MsgType === 'text') {
        content = formatted.Content
    } else if (formatted.MsgType === 'image') {
        content = {
        type: 'image',
        content: {
            mediaId: formatted.MediaId
        },
        }
    } else if (formatted.MsgType === 'voice') {
        content = {
        type: 'voice',
        content: {
            mediaId: formatted.MediaId
        },
        }
    } else {
        content = '感谢您关注'
    }
    return content
}
export { chatgo }