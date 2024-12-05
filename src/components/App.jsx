import React, { useState, useEffect } from 'react'
import './App.css'
import Search from "./Search"
import Results from "./Results"
import DailyPuzzle from "./DailyPuzzle"
import { fetchPlayers } from '../services/searchService'
import { useAuthentication } from '../services/authService'
import { SignIn, SignOut } from './Auth'
import { addFavoritePlayer, removeFavoritePlayer, getFavoritePlayers } from "../services/favorites";



export default function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [players, setPlayers] = useState([])
  const [favorites, setFavorites] = useState([]);
  const user = useAuthentication()

  useEffect(() => {
    if (searchTerm) {
      fetchPlayers(encodeURIComponent(searchTerm))
        .then(setPlayers)
        .catch((err) => console.error("Error fetching players:", err))
    }
  }, [searchTerm])

  useEffect(() => {
    if (user) {
      getFavoritePlayers()
        .then(setFavorites)
        .catch((err) => console.error("Error fetching favorites:", err))
    } else {
      setFavorites([])
    }
  }, [user])

  const handleAddFavorite = (player) => {
    const playerId = player.id;
    const playerData = { name: player.name, rank: player.rank };

    addFavoritePlayer(playerId, playerData)
      .then(() => {
        setFavorites((prev) => [...prev, { id: playerId, ...playerData }])
      })
      .catch((err) => console.error("Error adding favorite:", err))
  }

  const handleRemoveFavorite = (playerId) => {
    removeFavoritePlayer(playerId)
      .then(() => {
        setFavorites((prev) => prev.filter((item) => item.id !== playerId))
      })
      .catch((err) => console.error("Error removing favorite:", err))
  }

  return (
    <div className="App">
      <header>
        <h1>ChessMate</h1>
        {!user ? <SignIn /> : <SignOut />}
      </header>

      <main className="main-content">
        <Search setter={setSearchTerm} />

        <Results 
          players={players} 
          onAddFavorite={handleAddFavorite} 
          favorites={favorites} 
          onRemoveFavorite={handleRemoveFavorite} 
        />

        {user && (
          <>
            <h2>Your Favorites</h2>
            <ul>
              {favorites.map((favorite) => (
                <li key={favorite.id}>
                  {favorite.name} - {favorite.rank}
                  <button onClick={() => handleRemoveFavorite(favorite.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
