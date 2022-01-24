import userInterface from '@/components/interface/user';

export default {
  state: {
    users: [],
  },
  mutations: {
    SOCKET_createApp(
      state: { users: [userInterface] },
      data: { users: [userInterface]; gameStatus: boolean },
    ): void {
      state.users = data.users;
    },

    SOCKET_updateUsers(state: { users: [userInterface] }, users: [userInterface]): void {
      state.users = users;
    },
  },
  actions: {
    // SOCKET_createApp(ctx: any, data: { users: []; gameStatus: boolean }) {
    //   console.log(' data received: ', data);
    // },
    // SOCKET_addUser(ctx: any, data: { users: []; gameStatus: boolean }): void {
    // },
  },
  getters: {
    getUsers: (state: { users: userInterface[] }): userInterface[] => state.users,
    getColors: (state: { users: userInterface[] }): string[] => state.users.map((u) => u.color),
  },
};
