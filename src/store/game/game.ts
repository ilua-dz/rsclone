import gameDeckInterface from '@/components/interface/gameDeck';

export default {
  state: {
    gameStatus: false,
    gameTurn: -1,
    gameDeck: {},
  },
  mutations: {
    SOCKET_createApp(
      state: {
        gameStatus: boolean;
        gameTurn: number;
        gameDeck: gameDeckInterface;
      },
      data: {
        gameStatus: boolean;
        gameTurn: number;
        gameDeck: gameDeckInterface;
      },
    ): void {
      state.gameStatus = data.gameStatus;
      state.gameTurn = data.gameTurn;
      state.gameDeck = data.gameDeck;
    },
    SOCKET_updateGameStatus(state: { gameStatus: boolean }, gameStatus: boolean): void {
      state.gameStatus = gameStatus;
    },
    SOCKET_updateGameTurn(state: { gameTurn: number }, gameTurn: number): void {
      state.gameTurn = gameTurn;
    },
    SOCKET_preTurn(state: { gameDeck: gameDeckInterface }, gameDeck: gameDeckInterface): void {
      state.gameDeck = gameDeck;
    },
  },
  actions: {},
  getters: {
    getGameStatus: (state: { gameStatus: boolean }): boolean => state.gameStatus,
    getTurn: (state: { gameTurn: number }): number => state.gameTurn,
    getRouteDeck: (state: { gameDeck: gameDeckInterface }): number[] => state.gameDeck.route,
    getCardDeck: (state: { gameDeck: gameDeckInterface }): string[] => state.gameDeck.deck,
    getCardTable: (state: { gameDeck: gameDeckInterface }): string[] => state.gameDeck.table,
  },
};
