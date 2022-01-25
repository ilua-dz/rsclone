import userInterface from '@/components/interface/user';
import railwayInterface from '@/components/interface/railway';

export default {
  state: {
    railways: [],
  },
  mutations: {
    SOCKET_createApp(
      state: { railways: railwayInterface[] },
      data: { users: userInterface[]; gameStatus: boolean; railways: railwayInterface[] },
    ): void {
      state.railways = data.railways;
    },

    // SOCKET_updateUsers(state: { users: userInterface[] }, users: [userInterface]): void {
    //   state.users = users;
    // },
  },
  actions: {
    // SOCKET_createApp(ctx: any, data: { users: []; gameStatus: boolean }) {
    //   console.log(' data received: ', data);
    // },
    // SOCKET_addUser(ctx: any, data: { users: []; gameStatus: boolean }): void {
    // },
  },
  getters: {
    getRailways: (state: { railways: railwayInterface[] }): railwayInterface[] => state.railways,
    // getUsers: (state: { users: userInterface[] }): userInterface[] => state.users,
    // getColors: (state: { users: userInterface[] }): string[] => state.users.map((u) => u.color),
  },
};
