const playSound = (sound: string): void => {
  const audio = new Audio();
  audio.src = `assets/game/sounds/${sound}.mp3`;
  audio.volume = 0.2;
  audio.addEventListener('loadeddata', () => audio.play());
};

export default playSound;
