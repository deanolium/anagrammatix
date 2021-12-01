import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EVENTS } from 'shared'
import { RootStateType } from '../redux'
import { selectGameScores } from '../redux/selectors/gameStoreSelectors'
import 'twin.macro'
import 'styled-components/macro'

const waitLength = 4000

const GameScores: FC = () => {
  const dispatch = useDispatch()

  const playerScores = useSelector(selectGameScores)

  const [displayIndex, setDisplayIndex] = useState(0)

  const displayArr: { message: string; players?: any[] }[] = [
    {
      message: `End of the Game!!`,
    },
  ]

  const sortedPlayerScores = [...playerScores]
  console.log(playerScores)

  sortedPlayerScores.sort((a: any, b: any) => {
    return b.score - a.score
  })

  const winner = sortedPlayerScores[0]

  displayArr.push({
    message: `${winner.name} is the Winner!!! (${winner.score} pts) 🎉`,
  })

  displayArr.push({
    message: `Scores`,
    players: sortedPlayerScores,
  })

  useEffect(() => {
    var intervalRef = setInterval(() => {
      setDisplayIndex(val => {
        let newVal = val + 1
        if (newVal === displayArr.length) {
          newVal = 0
        }

        return newVal
      })
    }, waitLength)

    return () => {
      clearInterval(intervalRef)
    }
  }, [])

  const thingToDisplay = displayArr[displayIndex]

  const handleNewGame = () => {
    dispatch({
      type: EVENTS.CLIENT.CREATE_GAME,
    })
  }

  return (
    <div tw="container flex flex-col items-center bg-white w-max mx-auto pt-8 rounded-2xl shadow-lg min-h-[360px] pb-4">
      <header tw="relative mb-6 w-[600px] flex justify-center px-16">
        <h2 tw="text-2xl font-bold">{thingToDisplay.message}</h2>
      </header>
      <section tw="flex flex-1 flex-col items-center mb-8 px-4">
        {thingToDisplay.players && (
          <ul>
            {thingToDisplay.players.map(player => (
              <li key={player.id} tw="text-3xl text-indigo-900 font-bold">
                {player.name}: {player.score}pts
              </li>
            ))}
          </ul>
        )}
      </section>
      <button
        tw="flex-none my-2 text-xl border border-gray-200 rounded-2xl px-4 py-1 bg-gray-100 cursor-pointer hover:bg-indigo-100 transition-all duration-500 shadow"
        onClick={handleNewGame}
      >
        New Game
      </button>
    </div>
  )
}

export default GameScores
