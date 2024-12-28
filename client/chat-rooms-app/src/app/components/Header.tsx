import React from 'react'

const Header: React.FC<Room> = ({id, name}) => {
  return (
    <header className="bg-purple-600 text-white p-4 shadow-md flex justify-between items-center">
  <div>
    <a href="/" className="text-2xl font-bold hover:text-purple-300 transition-colors">
      Chat-Rooms App
    </a>
  </div>
  {id != null && name != null ? (
    <div className="text-lg font-medium">
      Chat-Room: <span className="font-bold">{name}</span> (<span className="text-sm">{id}</span>)
    </div>
  ) : (
    <div className="text-sm italic">No room selected</div>
  )}
</header>

  )
}

export default Header