const User = require('../models/User');

class ChatService {
    constructor(io) {
        this.io = io;
        this.onlineUsers = new Map();
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on('connection', async (socket) => {
            console.log('New client connected:', socket.id);

            // Handle user authentication
            const user = socket.handshake.auth.user;
            if (!user) {
                socket.disconnect();
                return;
            }

            // Store online user
            this.onlineUsers.set(user._id, {
                socketId: socket.id,
                username: user.username,
                email: user.email
            });

            // Fetch all registered users and send initial user list
            await this.updateUserList();

            // Handle private messages
            socket.on('message', async (message) => {
                const receiver = this.onlineUsers.get(message.receiverId);
                if (receiver) {
                    this.io.to(receiver.socketId).emit('message', {
                        senderId: user._id,
                        senderName: user.username,
                        content: message.content,
                        timestamp: new Date()
                    });
                }
            });

            // Handle typing indicators
            socket.on('typing', (data) => {
                const receiver = this.onlineUsers.get(data.userId);
                if (receiver) {
                    this.io.to(receiver.socketId).emit('typing', {
                        userId: user._id,
                        username: user.username
                    });
                }
            });

            socket.on('stop-typing', (data) => {
                const receiver = this.onlineUsers.get(data.userId);
                if (receiver) {
                    this.io.to(receiver.socketId).emit('stop-typing', {
                        userId: user._id
                    });
                }
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                this.onlineUsers.delete(user._id);
                this.updateUserList();
            });
        });
    }

    async updateUserList() {
        try {
            const users = await User.find({}, '_id username email');
            const userList = users.map(user => ({
                ...user.toObject(),
                online: this.onlineUsers.has(user._id)
            }));
            this.io.emit('user-list', userList);
        } catch (error) {
            console.error('Error updating user list:', error);
        }
    }
}

module.exports = ChatService; 