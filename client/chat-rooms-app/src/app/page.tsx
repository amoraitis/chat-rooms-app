"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoomList from "@/app/components/RoomList";
import { apiService } from "@/services/apiService";

const HomePage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load username from localStorage on mount
    const storedUsername = localStorage.getItem("chat-username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Fetch rooms
    const fetchRooms = async () => {
      try {
        const rooms = await apiService.getRooms();
        setRooms(rooms);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleJoinRoom = (roomId: string) => {
    if (!username.trim()) {
      alert("Please enter your username before joining a room.");
      return;
    }

    // Store the username in localStorage
    localStorage.setItem("chat-username", username);
    router.push(`/room/${roomId}`);
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      alert("Room name cannot be empty.");
      return;
    }

    try {
      const newRoom = await apiService.createRoom(newRoomName);
      
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      
      // Clear the input field
      setNewRoomName("");
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await apiService.deleteRoom(roomId);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (

    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-purple-600">Available Chat Rooms</h1>

        {/* Username Input */}
        <div className="mt-6 flex flex-col items-center">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full max-w-md p-2 border border-gray-300 rounded-md text-gray-500"
          />
        </div>

        {/* Room Creation Section */}
        <div className="mt-6 flex flex-col items-center">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter new room name"
            className="w-full max-w-md p-2 border border-gray-300 rounded-md text-gray-500"
          />
          <button
            onClick={handleCreateRoom}
            className="mt-3 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
          >
            Create Room
          </button>
        </div>

        {/* Room List */}
        <RoomList
          rooms={rooms}
          onJoinRoom={handleJoinRoom}
          onDeleteRoom={handleDeleteRoom}
        />
      </div>
    </main>
  );
};

export default HomePage;
