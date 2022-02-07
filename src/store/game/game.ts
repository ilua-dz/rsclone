export default {
  state: {
    gameStatus: false,
    gameTurn: -1,
  },
  mutations: {
    SOCKET_createApp(state: { gameStatus: boolean, gameTurn: number },
      data: { gameStatus: boolean, gameTurn: number }): void {
      state.gameStatus = data.gameStatus;
      state.gameTurn = data.gameTurn;
    },
    SOCKET_updateGameStatus(state: { gameStatus: boolean }, gameStatus: boolean): void {
      state.gameStatus = gameStatus;
    },
    SOCKET_updateGameTurn(state: { gameTurn: number }, gameTurn: number): void {
      state.gameTurn = gameTurn;
    },
  },
  actions: {},
  getters: {
    getGameStatus: (state: { gameStatus: boolean }): boolean => state.gameStatus,
    getTurn: (state: {gameTurn: number}): number => state.gameTurn,
  },
};
