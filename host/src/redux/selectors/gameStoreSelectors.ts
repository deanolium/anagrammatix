import { createSelector } from '@reduxjs/toolkit'
import { RootStateType } from '..'

const selectGameStore = (root: RootStateType) => root.gameStore

export const selectGameID = createSelector(
  selectGameStore,
  store => store.gameID
)

export const selectPlayers = createSelector(
  selectGameStore,
  store => store.players
)

export const selectGameScores = createSelector(
  selectGameStore,
  store => store.gameScores
)

export const selectRoundInfo = createSelector(selectGameStore, store => ({
  masterWord: store.masterWord!,
  roundNumber: store.roundNumber!,
}))

export const selectRoundResults = createSelector(
  selectGameStore,
  store => store.roundResults
)
