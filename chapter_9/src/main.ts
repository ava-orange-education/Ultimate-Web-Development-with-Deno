import { Server } from "socket.io";
import type { Socket } from "socket.io";
import { createServer } from "node:http";
import { instrument } from "@socket.io/admin-ui";

// Type definitions for our chat application
interface User {
  id: string;
  username: string;
  connectedAt: Date;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  room: string;
  timestamp: Date;
}

interface ChatRoom {
  name: string;
  createdAt: Date;
  messages: ChatMessage[];
}

interface ChatMessageData {
  message: string;
  room?: string;
}

// Create HTTP server with static file serving
const httpServer = createServer(async (req, res) => {
  // Serve the HTML file for the root path
  if (req.url === "/" || req.url === "/index.html") {
    try {
      const htmlContent = await Deno.readTextFile("./public/index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(htmlContent);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading chat interface");
    }
    return;
  }

  // Serve Socket.io client library
  if (req.url === "/socket.io/socket.io.js") {
    try {
      // In a real application, you would serve the actual Socket.io client library
      // For this demo, we'll redirect to the CDN version
      res.writeHead(302, { "Location": "https://cdn.socket.io/4.7.5/socket.io.min.js" });
      res.end();
    } catch (_error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading Socket.io client");
    }
    return;
  }

  // Default 404 response
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

// Initialize Socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:3000"],
    credentials: true
  }
});

// Instrument Socket.io with Admin UI
instrument(io, {
  auth: false, // For development only - use proper auth in production
  mode: "development",
});

// In-memory storage for demo purposes
// In a real application, use a proper database
const connectedUsers = new Map<string, User>();
const chatRooms = new Map<string, ChatRoom>();

// Middleware for authentication (simplified for demo)
io.use((socket: Socket, next: (err?: Error) => void) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Username is required"));
  }
  socket.data.username = username;
  next();
});

// Handle new connections
io.on("connection", (socket: Socket) => {
  const username = socket.data.username;
  console.log(`User ${username} connected with ID: ${socket.id}`);

  // Add user to connected users map
  connectedUsers.set(socket.id, {
    id: socket.id,
    username: username,
    connectedAt: new Date(),
  });

  // Join default room
  socket.join("general");

  // Notify all clients about new user
  socket.broadcast.emit("user_joined", {
    username: username,
    message: `${username} joined the chat`,
    timestamp: new Date(),
  });

  // Send current user list to the new user
  socket.emit("user_list", Array.from(connectedUsers.values()));

  // Handle chat messages
  socket.on("chat_message", (data: ChatMessageData) => {
    const message = {
      id: Date.now().toString(),
      username: username,
      message: data.message,
      room: data.room || "general",
      timestamp: new Date(),
    };

    console.log(`Message from ${username}: ${data.message}`);

    // Broadcast message to the specific room
    io.to(message.room).emit("new_message", message);
  });

  // Handle room joining
  socket.on("join_room", (roomName: string) => {
    // Join the new room without leaving the general room
    socket.join(roomName);

    // Initialize room if it doesn't exist
    if (!chatRooms.has(roomName)) {
      chatRooms.set(roomName, {
        name: roomName,
        createdAt: new Date(),
        messages: [],
      });
    }

    socket.emit("room_joined", {
      room: roomName,
      message: `You joined room: ${roomName}`,
    });

    socket.to(roomName).emit("user_joined_room", {
      username: username,
      room: roomName,
      message: `${username} joined the room`,
    });
  });

  // Handle typing indicators
  socket.on("typing_start", () => {
    socket.broadcast.emit("user_typing", {
      username: username,
      isTyping: true,
    });
  });

  socket.on("typing_stop", () => {
    socket.broadcast.emit("user_typing", {
      username: username,
      isTyping: false,
    });
  });

  // Handle disconnection
  socket.on("disconnect", (reason: string) => {
    console.log(`User ${username} disconnected: ${reason}`);

    // Remove user from connected users
    connectedUsers.delete(socket.id);

    // Notify other users
    socket.broadcast.emit("user_left", {
      username: username,
      message: `${username} left the chat`,
      timestamp: new Date(),
    });
  });

  // Handle errors
  socket.on("error", (error: Error) => {
    console.error(`Socket error for user ${username}:`, error);
  });
});

// Start the server
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on http://localhost:${PORT}`);
  console.log(`📊 Admin UI available at https://admin.socket.io`);
  console.log(`🔗 Connect with: ws://localhost:${PORT}`);
});
