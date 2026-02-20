import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseServerIo = NextApiResponse & {
     socket: any & {
          server: NetServer & {
               io: ServerIO;
          };
     };
};

export const config = {
     api: {
          bodyParser: false,
     },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
     if (!res.socket.server.io) {
          console.log("Starting Socket.io server...");
          const path = "/api/socket/io";
          const httpServer: NetServer = res.socket.server as any;
          const io = new ServerIO(httpServer, {
               path: path,
               addTrailingSlash: false,
               cors: {
                    origin: "*",
                    methods: ["GET", "POST"],
               },
          });

          io.on("connection", (socket) => {
               console.log("Socket connected:", socket.id);

               socket.on("join-room", (conversationId: string) => {
                    socket.join(conversationId);
                    console.log(`Socket ${socket.id} joined room ${conversationId}`);
               });

               socket.on("send-message", async (data) => {
                    // data: { conversationId, message, senderId, ... }
                    // Broadcast to everyone in the room EXCEPT sender (sender handles optimistic UI)
                    // Or broadcast to everyone including sender if we want simple logic
                    socket.to(data.conversationId).emit("new-message", data);

                    // Note: We'll handle Firestore persistence in the client for simplicity/optimistic UI
                    // or we could do it here. For this plan, UI saves to Firestore, then emits to Socket.
               });

               socket.on("disconnect", () => {
                    console.log("Socket disconnected:", socket.id);
               });
          });

          res.socket.server.io = io;
     } else {
          console.log("Socket.io server already running");
     }
     res.end();
};

export default ioHandler;
