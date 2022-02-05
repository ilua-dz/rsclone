interface userInterface {
  name: string;
  color: string;
  ready: boolean;
  hand: {
    longRoute: number | undefined;
    shortRoute: number[];
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
  };
}

export default userInterface;
