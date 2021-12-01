import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EVENTS } from 'shared'
import { selectRoundInfo } from '../redux/selectors/gameStoreSelectors'
import 'twin.macro'
import 'styled-components/macro'

const RoundIntro: FC = () => {
  const dispatch = useDispatch()
  const [count, setCount] = useState(3)
  const [showCount, setShowCount] = useState(false)

  const { roundNumber } = useSelector(selectRoundInfo)

  useEffect(() => {
    setTimeout(() => {
      setShowCount(true)
      setInterval(() => {
        setCount(curValue => curValue - 1)
      }, 1000)
    }, 2000 + Math.round(Math.random() * 3) * 1000)
  }, [dispatch])

  useEffect(() => {
    if (count <= 0) {
      dispatch({ type: EVENTS.CLIENT.START_ROUND })
    }
  }, [count, dispatch])

  if (count === 0) {
    return null
  }

  return (
    <div tw="flex flex-col items-center bg-white w-max mx-auto p-8 rounded-2xl shadow-lg">
      <h1 tw="font-bold text-2xl mb-4">Round {roundNumber}/5</h1>
      <h2 tw="text-7xl font-extrabold text-red-800 transition-all animate-nupulse">
        {showCount ? count : <span>&nbsp;</span>}
      </h2>
    </div>
  )
}

export default RoundIntro
