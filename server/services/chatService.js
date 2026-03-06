const User = require('../../models/User');

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
            this.onlineUsers.set(user.id, {
                socketId: socket.id,
                username: user.username,
                email: user.email
            });

            // Fetch all registered users and send initial user list
            await this.updateUserList();

            // Handle messages
            socket.on('message', async (message) => {
                console.log('Received message from client:', message);
                console.log('User object from socket:', user);
                console.log('User ID:', user.id);
                console.log('User username:', user.username);
                console.log('Message receiverId:', message.receiverId);
                
                const senderName = user.username || `User ${user.id?.substring(0, 8) || 'Unknown'}`;
                
                if (message.receiverId) {
                    // Private message to specific user
                    const receiver = this.onlineUsers.get(message.receiverId);
                    if (receiver) {
                        this.io.to(receiver.socketId).emit('message', {
                            senderId: user.id,
                            senderName: senderName,
                            content: message.content,
                            timestamp: new Date(),
                            isPrivate: true
                        });
                        
                        // Also send back to sender for their own chat history
                        socket.emit('message', {
                            senderId: user.id,
                            senderName: senderName,
                            receiverName: receiver.username,
                            content: message.content,
                            timestamp: new Date(),
                            isPrivate: true
                        });
                    }
                } else {
                    // Broadcast to all users (group chat)
                    socket.broadcast.emit('message', {
                        senderId: user.id,
                        senderName: senderName,
                        content: message.content,
                        timestamp: new Date(),
                        isPrivate: false
                    });
                    
                    // Also send back to sender for their own chat history
                    socket.emit('message', {
                        senderId: user.id,
                        senderName: senderName,
                        content: message.content,
                        timestamp: new Date(),
                        isPrivate: false
                    });
                }
            });

            // Handle typing indicators
            socket.on('typing', (data) => {
                // Broadcast to all other users that this user is typing
                const username = user.username || `User ${user.id?.substring(0, 8) || 'Unknown'}`;
                socket.broadcast.emit('typing', {
                    userId: user.id,
                    username: username
                });
            });

            socket.on('stop-typing', () => {
                // Broadcast to all other users that this user stopped typing
                socket.broadcast.emit('stop-typing', {
                    userId: user.id
                });
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                this.onlineUsers.delete(user.id);
                this.updateUserList();
            });
        });
    }

    async updateUserList() {
        try {
            const users = await User.find({}, '_id username email role');
            const userList = users.map(user => ({
                ...user.toObject(),
                online: this.onlineUsers.has(user._id.toString())
            }));
            this.io.emit('user-list', userList);
        } catch (error) {
            console.error('Error updating user list:', error);
        }
    }
}

module.exports = ChatService; 