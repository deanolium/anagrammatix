import React from 'react'
import logo from './logo.svg'
import 'twin.macro'
import 'styled-components/macro'

function App() {
  return (
    <div className="App">
      <header className="App-header" tw="p-5">
        <img tw="w-10 h-10" src={logo} className="App-logo" alt="logo" />
        <p tw="text-red-800 my-5 bg-gray-300 rounded-xl px-4 py-2 shadow-xl">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App
