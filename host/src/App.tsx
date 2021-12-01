import React from 'react'
import 'twin.macro'
import 'styled-components/macro'
import GamePage from './GamePage'

function App() {
  return (
    <div tw="h-screen w-screen bg-indigo-50 pt-8">
      <GamePage />
    </div>
  )
}

export default App
