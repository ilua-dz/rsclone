import userInterface from '@/components/interface/user';
import Storage from '@/components/localStorage/storage';
// import taskInterface from '@/components/interface/taskInterface';
// import testTask from '@/components/Game/testTask';
// import taskInfo from './taskInfo';

export default {
  state: {
    users: [],
    currentName: '',
    currentColor: '',
    // currentTasks: [],
    // completedTask: [],
  },
  mutations: {
    SOCKET_createApp(
      state: {
        users: [userInterface],
        currentName: string,
        // currentTasks: taskInterface[],
        // completedTasks: taskInterface[],
      },
      data: { users: [userInterface], gameStatus: boolean },
    ): void {
      state.users = data.users;
      const storage = new Storage();
      if (storage.data.name) state.currentName = storage.data.name;
      // const currentUser = state.users.find((user) => user.name === state.currentName);
      // if (currentUser) {
      //   state.currentTasks = currentUser.hand.shortRoute.map((route) => taskInfo[route]);
      //   if (typeof currentUser.hand.longRoute === 'number'
      // && currentUser.hand.longRoute !== -1) {
      //     state.currentTasks.push(taskInfo[currentUser.hand.longRoute + 40]);
      //   }
      //   state.completedTasks = [];
      //   state.currentTasks.forEach((task) => {
      //     if (testTask(task.cities, currentUser.hand.connected)) {
      //       state.completedTasks.push(task);
      //     }
      //   });
      //   console.log(state.completedTasks);
      // }
    },

    SOCKET_updateUsers(state: {
      users: [userInterface],
      currentColor: string,
      currentName: string,
      // currentTasks: taskInterface[],
      // completedTasks: taskInterface[],
    }, users: [userInterface]): void {
      state.users = users;
      state.currentColor = state.users.find((u) => u.name === state.currentName)?.color || '';
      // const currentUser = state.users.find((user) => user.name === state.currentName);
      // if (currentUser) {
      //   state.currentTasks = currentUser.hand.shortRoute.map((route) => taskInfo[route]);
      //   if (typeof currentUser.hand.longRoute === 'number'
      // && currentUser.hand.longRoute !== -1) {
      //     state.currentTasks.push(taskInfo[currentUser.hand.longRoute + 40]);
      //   }
      //   state.completedTasks = [];
      //   state.currentTasks.forEach((task) => {
      //     if (testTask(task.cities, currentUser.hand.connected)) {
      //       state.completedTasks.push(task);
      //     }
      //   });
      //   console.log(state.completedTasks);
      // }
    },

    setCurrentName(state: { users: [userInterface], currentName: string }, name: string): void {
      state.currentName = name;
    },

    setCurrentColor(state: { users: [userInterface], currentColor: string }, color: string): void {
      state.currentColor = color;
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
    getCurrentName: (state: { currentName: string }): string => state.currentName,
    // getCurrentTasks: (state: {
    //   currentTasks: taskInterface[]
    // }): taskInterface[] => state.currentTasks,

  },
};
