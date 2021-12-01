import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectRoundResults } from '../redux/selectors/gameStoreSelectors'
import 'twin.macro'
import 'styled-components/macro'
import { showRoundIntro } from '../redux/slices/gameStore'

const waitLength = 4000

const RoundScores: FC = () => {
  const dispatch = useDispatch()

  const results = useSelector(selectRoundResults)

  const [displayIndex, setDisplayIndex] = useState(0)

  const displayArr: { message: string; players?: any[] }[] = [
    {
      message: `The correct word was ${results.correctWord}`,
    },
  ]

  if (results.winner) {
    displayArr.push({
      message: 'Winner',
      players: [results.winner],
    })
  }

  if (results.losers.length > 0) {
    displayArr.push({
      message: 'Losers',
      players: [...results.losers],
    })
  }
  if (results.timeOuters.length > 0) {
    displayArr.push({
      message: 'Slowzers',
      players: [...results.timeOuters],
    })
  }

  useEffect(() => {
    var intervalRef = setInterval(() => {
      setDisplayIndex(val => val + 1)
    }, waitLength)

    return () => {
      clearInterval(intervalRef)
    }
  }, [])

  useEffect(() => {
    if (displayIndex === displayArr.length) {
      // setDisplayIndex(0)
      dispatch(showRoundIntro())
    }
  }, [dispatch, displayArr.length, displayIndex])

  if (displayIndex === displayArr.length) {
    return null
  }

  const thingToDisplay = displayArr[displayIndex]
  return (
    <div tw="container flex flex-col items-center bg-white w-max mx-auto pt-8 rounded-2xl shadow-lg min-h-[360px]">
      <header tw="relative mb-6 w-full flex justify-center px-16">
        <h1 tw="font-bold text-4xl px-2">End of Round</h1>
      </header>
      <section tw="flex flex-col items-center mb-8 px-4">
        <h2 tw="text-4xl mb-2 font-bold text-gray-500">
          {thingToDisplay.message}
        </h2>
        {thingToDisplay.players && (
          <ul>
            {thingToDisplay.players.map(player => (
              <li key={player.id} tw="text-4xl text-indigo-900 font-bold">
                {player.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default RoundScores
