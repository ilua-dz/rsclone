export default {
  state: {
    gameStatus: false,
  },
  mutations: {
    SOCKET_createApp(state: { gameStatus: boolean }, data: { gameStatus: boolean }): void {
      state.gameStatus = data.gameStatus;
    },
    SOCKET_updateGameStatus(state: { gameStatus: boolean }, gameStatus: boolean): void {
      state.gameStatus = gameStatus;
    },
  },
  actions: {},
  getters: {
    getGameStatus: (state: { gameStatus: boolean }): boolean => state.gameStatus,
  },
};
