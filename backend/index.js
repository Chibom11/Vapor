import { WebSocket, WebSocketServer } from "ws";
import { nanoid } from "nanoid"; // You might need to install nanoid: npm i nanoid

const wss = new WebSocketServer({ port: 8080 });

// We'll use a Map for better performance when finding/deleting sockets
const allSockets = new Map();

wss.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);

        // When a user joins a room
        if (parsedMessage.type === "join") {
            const { roomId, name } = parsedMessage.payload;
            // Store user info with their socket connection
            allSockets.set(socket, {
                room: roomId,
                username: name,
            });
            console.log(`User '${name}' joined room '${roomId}'`);
        }

        // When a chat message is sent
        if (parsedMessage.type === "chat") {
            const currentUser = allSockets.get(socket);
            if (!currentUser) return; // Ignore messages from unknown sockets

            const currentRoom = currentUser.room;
            const senderName = currentUser.username;

            // Create a message object to broadcast
            const broadcastMessage = {
                type: "newMessage", 
                payload: {
                    id: nanoid(), 
                    text: parsedMessage.payload.message,
                    sender: senderName,
                    timestamp: new Date().toISOString(),
                },
            };

            // Send the message object to every user in the same room
            for (const [clientSocket, clientInfo] of allSockets.entries()) {
                if (clientInfo.room === currentRoom && clientSocket.readyState === WebSocket.OPEN) {
                    clientSocket.send(JSON.stringify(broadcastMessage));
                }
            }
        }
    });

    socket.on("close", () => {
        const user = allSockets.get(socket);
        if (user) {
            console.log(`User '${user.username}' disconnected`);
            allSockets.delete(socket); // Clean up when a user disconnects
        } else {
            console.log("An unknown client disconnected");
        }
    });

    socket.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

console.log("WebSocket server started on port 8080");
