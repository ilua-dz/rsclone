import userInterface from '@/components/interface/user';
import Storage from '@/components/localStorage/storage';

export default {
  state: {
    users: [],
    currentName: '',
    currentColor: '',
  },
  mutations: {
    SOCKET_createApp(
      state: {
        users: [userInterface],
        currentName: string,
      },
      data: { users: [userInterface], gameStatus: boolean },
    ): void {
      state.users = data.users;
      const storage = new Storage();
      if (storage.data.name) state.currentName = storage.data.name;
    },

    SOCKET_updateUsers(state: {
      users: [userInterface],
      currentColor: string,
      currentName: string,
    }, users: [userInterface]): void {
      state.users = users;
      state.currentColor = state.users.find((u) => u.name === state.currentName)?.color || '';
    },

    setCurrentName(state: { users: [userInterface], currentName: string }, name: string): void {
      state.currentName = name;
    },

    setCurrentColor(state: { users: [userInterface], currentColor: string }, color: string): void {
      state.currentColor = color;
    },

  },
  getters: {
    getUsers: (state: { users: userInterface[] }): userInterface[] => state.users,
    getColors: (state: { users: userInterface[] }): string[] => state.users.map((u) => u.color),
    getCurrentName: (state: { currentName: string }): string => state.currentName,
    getCompletedLength: (state: { users: userInterface[], currentName: string }): number => state
      .users.filter((u) => u.name === state.currentName)[0].hand.completedTasks.length,
  },
};
