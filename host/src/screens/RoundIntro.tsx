import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EVENTS } from 'shared'
import { selectRoundInfo } from '../redux/selectors/gameStoreSelectors'
import 'twin.macro'
import 'styled-components/macro'
import Container from '../components/Container'

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
    <Container>
      <h1 tw="font-bold text-2xl mb-4">Round {roundNumber}/5</h1>
      <h2 tw="text-7xl font-extrabold text-red-800 transition-all animate-nupulse">
        {showCount ? count : <span>&nbsp;</span>}
      </h2>
    </Container>
  )
}

export default RoundIntro
