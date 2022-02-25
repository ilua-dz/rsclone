import gameDeckInterface from '@/components/interface/gameDeck';
import resultInterface from '@/components/interface/result';

export default {
  state: {
    gameStatus: false,
    gameTurn: -2,
    gameDeck: {},
    turnWeight: 0,
    result: [],
    turnToEnd: 9999,
    countOfGames: 0,
  },
  mutations: {
    SOCKET_createApp(
      state: {
        gameStatus: boolean;
        gameTurn: number;
        gameDeck: gameDeckInterface;
        turnWeight: number;
        result: resultInterface[];
        turnToEnd: number;
        countOfGames: number;
      },
      data: {
        gameStatus: boolean;
        gameTurn: number;
        gameDeck: gameDeckInterface;
        turnWeight: number;
        result: resultInterface[];
        turnToEnd: number;
        countOfGames: number;
      },
    ): void {
      state.gameStatus = data.gameStatus;
      state.gameTurn = data.gameTurn;
      state.gameDeck = data.gameDeck;
      state.turnWeight = data.turnWeight;
      state.result = data.result;
      state.turnToEnd = data.turnToEnd;
      state.countOfGames = data.countOfGames;
    },
    SOCKET_updateGameStatus(state: { gameStatus: boolean }, gameStatus: boolean): void {
      state.gameStatus = gameStatus;
    },
    SOCKET_updateGameTurn(state: { gameTurn: number }, gameTurn: number): void {
      state.gameTurn = gameTurn;
    },
    SOCKET_updateTurnWeight(state: { turnWeight: number }, turnWeight: number): void {
      state.turnWeight = turnWeight;
    },
    SOCKET_preTurn(state: { gameDeck: gameDeckInterface }, gameDeck: gameDeckInterface): void {
      state.gameDeck = gameDeck;
    },
    SOCKET_setTurnToEnd(state: { turnToEnd: number }, turnToEnd: number): void {
      state.turnToEnd = turnToEnd;
    },
  },
  actions: {},
  getters: {
    getGameStatus: (state: { gameStatus: boolean }): boolean => state.gameStatus,
    getTurn: (state: { gameTurn: number }): number => state.gameTurn,
    getRouteDeck: (state: { gameDeck: gameDeckInterface }): number[] => state.gameDeck.route,
    getCardDeck: (state: { gameDeck: gameDeckInterface }): string[] => state.gameDeck.deck,
    getCardTable: (state: { gameDeck: gameDeckInterface }): string[] => state.gameDeck.table,
    getTurnWeight: (state: { turnWeight: number }): number => state.turnWeight,
    getTurnToEnd: (state: { turnToEnd: number }): number => state.turnToEnd,
    getCountOfGames: (state: { countOfGames: number }): number => (state.countOfGames
      ? state.countOfGames : 0),
    getResult: (state: {
      result: resultInterface[]
    }): resultInterface[] => (state.result
      ? state.result.sort((a, b) => b.points - a.points)
      : []),
  },
};
