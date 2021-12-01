import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { showRoundIntro } from '../redux/slices/gameStore'
import 'twin.macro'
import 'styled-components/macro'

const GameIntro: FC = () => {
  const dispatch = useDispatch()
  const [count, setCount] = useState(3)

  useEffect(() => {
    setInterval(() => {
      setCount(curValue => curValue - 1)
    }, 1000)
  }, [dispatch])

  useEffect(() => {
    if (count <= 0) {
      dispatch(showRoundIntro())
    }
  }, [count, dispatch])

  if (count === 0) {
    return null
  }

  return (
    <div tw="flex flex-col items-center bg-white w-max mx-auto p-8 rounded-2xl shadow-lg">
      <h1 tw="font-bold text-2xl mb-4">Get Ready!</h1>
      <h2 tw="text-7xl font-extrabold text-red-800 transition-all animate-nupulse ">
        {count}
      </h2>
    </div>
  )
}

export default GameIntro
