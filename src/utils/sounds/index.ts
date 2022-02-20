const playSound = (sound: string): void => {
  const audio = new Audio();
  audio.src = `./assets/game/sounds/${sound}.mp3`;
  audio.play();
};

export default playSound;
