export default {
  state: {
    id: '',
    incomingMessage: '',
    history: [],
  },
  mutations: {
    SOCKET_createApp(
      state: {
        id: string;
        incomingMessage: string;
        history: {name: string, message: string}[];
      },
      data: {
        id: string
        chatHistory: {name: string, message: string}[];
      },
    ): void {
      state.id = data.id;
      state.history = data.chatHistory;
    },

    SOCKET_incomingMessage(
      state: { history: { name: string, message: string }[] },
      incoming: { name: string, message: string },
    ): void {
      console.log(incoming);
      console.log(state.history);
      state.history.push(incoming);
    },

  },
  actions: {},
  getters: {
    getId: (state: { id: string }): string => state.id,
    getHistory: (
      state: { history: { name: string, message: string }[] },
    ): { name: string, message: string }[] => state.history,
  },
};
