import taskInterface from './taskInterface';

interface userInterface {
  name: string;
  color: string;
  ready: boolean;
  points: number;
  preTurn: boolean;
  hand: {
    currentTasks: taskInterface[] ;
    // longRoute: taskInterface | null;
    // shortRoute: taskInterface[];
    trains: number;
    cards: {
      purple: number;
      white: number;
      blue: number;
      yellow: number;
      orange: number;
      red: number;
      black: number;
      green: number;
      loco: number;
    };
    stations: number;
    connected: Array<string[]>;
    completedTasks: taskInterface[];
  };
}

export default userInterface;
