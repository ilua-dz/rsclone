class Storage {
  public data: {
    name: string;
  };

  constructor() {
    if (!localStorage.getItem('game')) {
      this.data = { name: '' };
      localStorage.setItem('game', JSON.stringify(this.data));
    }
    this.data = JSON.parse(localStorage.getItem('game') as string);
  }

  saveData(): void {
    localStorage.setItem('game', JSON.stringify(this.data));
  }

  console(): void {
    console.log(this.data);
  }
}

export default Storage;
