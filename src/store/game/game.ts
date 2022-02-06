export default {
  state: {
    gameStatus: false,
    gameTurn: '',
  },
  mutations: {
    SOCKET_createApp(state: { gameStatus: boolean, gameTurn: string },
      data: { gameStatus: boolean, gameTurn: string }): void {
      state.gameStatus = data.gameStatus;
      state.gameTurn = data.gameTurn;
    },
    SOCKET_updateGameStatus(state: { gameStatus: boolean }, gameStatus: boolean): void {
      state.gameStatus = gameStatus;
    },
  },
  actions: {},
  getters: {
    getGameStatus: (state: { gameStatus: boolean }): boolean => state.gameStatus,
    getTurn: (state: {gameTurn: string}): string => state.gameTurn,
  },
};
