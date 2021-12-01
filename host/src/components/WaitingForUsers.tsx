import React, { FC } from 'react'
import 'twin.macro'
import 'styled-components/macro'
import { useDispatch, useSelector } from 'react-redux'
import { EVENTS } from 'shared'
import {
  selectGameID,
  selectPlayers,
} from '../redux/selectors/gameStoreSelectors'

const WaitingForUsers: FC = () => {
  const dispatch = useDispatch()
  const gameID = useSelector(selectGameID)

  const playerNames = useSelector(selectPlayers)

  const handleStartGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch({ type: EVENTS.CLIENT.START_GAME })
  }

  return (
    <div tw="flex flex-col items-center bg-white w-max mx-auto p-8 rounded-2xl shadow-lg min-h-[400px]">
      <h1 tw="text-indigo-800 font-bold text-2xl mb-2">
        Connect to Game: {gameID}
      </h1>
      <section tw="flex-1 mt-4 mb-6">
        {playerNames.length === 0 ? (
          <h2 tw="text-xl">Waiting for players...</h2>
        ) : (
          <>
            <h2 tw="text-xl">Today's Players are:</h2>
            <ul tw="flex flex-col items-center pt-3">
              {playerNames.map(name => (
                <li
                  tw="flex w-28 font-semibold text-green-800 items-center justify-center text-lg rounded-3xl py-1 px-2 bg-indigo-200 my-2 shadow cursor-default"
                  key={name}
                >
                  {name}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      {playerNames.length > 0 && (
        <button
          tw="flex-none my-2 text-xl  border border-gray-200 rounded-2xl px-4 py-1 bg-gray-100 cursor-pointer hover:bg-indigo-100 transition-all duration-500 shadow"
          onClick={handleStartGame}
        >
          Start Game
        </button>
      )}
    </div>
  )
}

export default WaitingForUsers
