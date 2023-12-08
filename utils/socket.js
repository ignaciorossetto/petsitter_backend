class WebSockets {
    constructor() {
        this.users = [];
        this.connection = this.connection.bind(this);
    }
    connection(client) {
      // event fired when the chat room is disconnected
      client.on("disconnect", () => {
        this.users = this.users?.filter((user) => user.socketId !== client.id);
      });
      // add identity of user mapped to the socket id
      client.on("identity", (userId) => {
          const aa = this.users.find((e)=> e.socketId === client.id && e.userId === userId)
          if (aa) {
            return
          }
          this.users?.push({
              socketId: client.id,
              userId: userId,
            });

      });
      client.on("logout", () => {
        this.users = this.users?.filter((user) => user.socketId !== client.id);
      });
      client.on("sendMessage", (data) => {
        const senderId = data.senderId
        const otherUserID = data.otherUserId
        const message = data.message
        const otherUser = this.users.filter((e)=>e.userId === otherUserID)

        global.io.to(otherUser[0]?.socketId).emit('getMessage',{ 
            senderId: senderId,
            message: message
            });
      });

      client.on("sendProposal", (data) => {
        console.log('hitted sendProposal')
        console.log(data)
        const senderId = data.sitterId
        const otherUserID = data.userId
        const message = data
        const otherUser = this.users.filter((e)=>e.userId === otherUserID)
        console.log('this.users: ', this.users)
        console.log(otherUser)

        global.io.to(otherUser[0]?.socketId).emit('getProposal',{ 
            senderId: senderId,
            message: message
            });
      })

      global.io.emit('welcome', 'welcome message!!')


      // subscribe person to chat & other user as well
      client.on("subscribe", (room, otherUserId = "") => {
        this.subscribeOtherUser(room, otherUserId);
        client.join(room);
      });
      // mute a chat room
      client.on("unsubscribe", (room) => {
        client.leave(room);
      });
    }
  
    subscribeOtherUser(room, otherUserId) {
      const userSockets = this.users.filter(
        (user) => user.userId === otherUserId
      );
      userSockets.map((userInfo) => {
        const socketConn = global.io.sockets.connected(userInfo.socketId);
        if (socketConn) {
          socketConn.join(room);
        }
      });
    }
  }
  
  export default new WebSockets();


  // when I call from frontend to "identity" appareantly this.users is undefined. I can not reach that array
