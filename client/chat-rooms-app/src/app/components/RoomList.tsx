import React from "react";

interface Room {
  id: string;
  name: string;
}

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onJoinRoom, onDeleteRoom }) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow flex flex-col items-start"
        >
          <h2
            className="text-2xl font-semibold text-gray-800 cursor-pointer"
            onClick={() => onJoinRoom(room.id)}
          >
            {room.name}
          </h2>
          <button
            onClick={() => onDeleteRoom(room.id)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring focus:ring-red-300"
          >
            Delete Room
          </button>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
