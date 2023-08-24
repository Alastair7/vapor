const { Schema, model } = require('mongoose')

const autoroleMessagesSchema = new Schema(
    {
        channelId: String,
        messageId: String,
        emojiMap: Map,
    },
    { collection: 'AutoroleMessages' }
)

const AutoroleMessage = model('AutoroleMessage', autoroleMessagesSchema)

module.exports = AutoroleMessage
