const Message = require('../models/message');

module.exports = {
    getMessage: async (req, res) => {
        try {
            const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    sendMessage: async (req, res) => {
        const { userId, username, content } = req.body;

        try {
            const message = new Message({ userId, username, content });
            await message.save();
            req.app.get('io').emit('message', message);
            res.status(201).json(message);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

