import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EVENTS } from 'shared'
import { selectRoundInfo } from '../redux/selectors/gameStoreSelectors'
import 'twin.macro'
import 'styled-components/macro'
import Container from '../components/Container'

const InRound: FC = () => {
  const dispatch = useDispatch()

  const { masterWord, roundNumber } = useSelector(selectRoundInfo)

  const [timeRemaining, setTimeRemaining] = useState(30)

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setTimeRemaining(val => val - 1)
      if (timeRemaining === 0) {
        clearInterval(intervalRef)
      }
    }, 1000)

    return () => {
      clearInterval(intervalRef)
    }
  }, [timeRemaining])

  useEffect(() => {
    if (timeRemaining <= 0) {
      dispatch({ type: EVENTS.CLIENT.ROUND_TIMED_OUT })
    }
  }, [dispatch, timeRemaining])

  if (timeRemaining === 0) {
    return null
  }

  return (
    <Container>
      <header tw="relative mb-6 w-full flex justify-center px-16">
        <hr tw="absolute top-1/2 w-full " />
        <h1 tw="relative font-bold text-4xl px-2 bg-white">
          Round {roundNumber}
        </h1>
      </header>
      <section tw="px-8 pb-6 flex flex-col items-center">
        <h2 tw="text-2xl font-bold mb-2">Master Word:</h2>
        <h2 tw="text-4xl font-bold">{masterWord}</h2>
      </section>
      <section tw="border-t-2 w-full flex flex-col items-center pt-3 pb-4 rounded-b-2xl bg-indigo-100">
        <p tw="font-bold text-gray-600 text-xl">
          Time remaining: {timeRemaining} secs
        </p>
      </section>
    </Container>
  )
}

export default InRound
