"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { signalRService } from "@/services/signalRService";
import { apiService } from "@/services/apiService";
import Header from "@/app/components/Header";

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState<Room>();
  const [onReceiveMessageEventAttached, setOnReceiveMessageEventAttached] =
    useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load username from localStorage
    const storedUsername = localStorage.getItem("chat-username");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    const messageHandler = (
      senderName: string,
      message: string,
      timestamp: string
    ) => {
        const roomIdStr = roomId as string;
        setMessages((prev) => [
          ...prev,
          { senderName, message, timestamp, roomId: roomIdStr },
        ]);
    };

    // Load chat history from the server
    apiService
      .fetchChatHistory(roomId as string)
      .then((chatHistoryResponse) => {
        setRoom(chatHistoryResponse.room);
        setMessages(chatHistoryResponse.messages);
        // Start SignalR connection and join the room
        if (signalRService.isConnected() === false) {
          signalRService
            .start()
            .then(() => signalRService.joinRoom(roomId as string));
        } else {
          signalRService.joinRoom(roomId as string);
        }

        if (onReceiveMessageEventAttached !== true){
          signalRService.onReceiveMessage(messageHandler);
          setOnReceiveMessageEventAttached(true);
        }
      });
    return () => {
      signalRService.offReceiveMessage(messageHandler);
      signalRService.leaveRoom(roomId as string);
    };
  }, [roomId]);

  window.onbeforeunload = function () {
      signalRService.leaveRoom(roomId as string);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !username.trim()) {
      alert("Username and message cannot be empty.");
      return;
    }

    // Save username to localStorage
    localStorage.setItem("chat-username", username);

    apiService
      .saveMessage(newMessage, roomId as string, username)
      .then((response) => {
        signalRService.sendMessage(
          roomId as string,
          username,
          newMessage,
          response.timestamp
        );
        console.log("Message saved successfully");
      })
      .catch((error) => console.error("Error saving message:", error));

    setNewMessage(""); // Clear the input field
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <Header id={room?.id} name={room?.name} />
      <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.senderName === username; // Adjust this variable to match the logged-in username.
          return (
            <div
              key={index}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              } mb-6`}
            >
              <div
                className={`max-w-xs md:max-w-sm p-4 rounded-lg shadow ${
                  isCurrentUser
                    ? "bg-purple-600 text-white text-right"
                    : "bg-gray-200 text-black text-left"
                }`}
              >
                <p className="text-sm font-semibold mb-1">{msg.senderName}</p>
                <p className="text-md">{msg.message}</p>
                <p className={`text-xs mt-2 ${
                  isCurrentUser
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>
      <footer className="p-4 bg-white border-t text-gray-500">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            className="flex-grow p-2 border rounded-md"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-purple-600 text-white rounded-md"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatRoom;
