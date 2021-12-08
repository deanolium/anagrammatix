import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EVENTS } from 'shared'
import GameIntro from './screens/GameIntro'
import GameScores from './screens/GameScores'
import InRound from './screens/InRound'
import RoundIntro from './screens/RoundIntro'
import RoundScores from './screens/RoundScores'
import WaitingForUsers from './screens/WaitingForUsers'
import { RootStateType } from './redux'
import { GameState } from './redux/slices/gameStore'

const GamePage: FC = () => {
  const dispatch = useDispatch()
  const gameState = useSelector<RootStateType, GameState>(
    state => state.gameStore.gameState
  )

  const noGameCreated = useSelector<RootStateType, boolean>(
    state => state.gameStore.gameState === GameState.NO_CONNECT
  )

  useEffect(() => {
    if (noGameCreated) {
      dispatch({
        type: EVENTS.CLIENT.CREATE_GAME,
      })
    }
  }, [dispatch, noGameCreated])

  switch (gameState) {
    case GameState.NO_CONNECT: {
      return <h1>Waiting for connection</h1>
    }

    case GameState.WAITING_FOR_PLAYERS: {
      return <WaitingForUsers />
    }

    case GameState.GAME_INTRO: {
      return <GameIntro />
    }

    case GameState.ROUND_INTRO: {
      return <RoundIntro />
    }

    case GameState.IN_ROUND: {
      return <InRound />
    }

    case GameState.SHOW_ROUND_SCORES: {
      return <RoundScores />
    }

    case GameState.SHOW_GAME_SCORES: {
      return <GameScores />
    }

    default: {
      return (
        <div>State: {GameState[gameState]} hasn't been implemented yet</div>
      )
    }
  }
}

export default GamePage
