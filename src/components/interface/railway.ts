interface railwayInterface {
  id: string;
  transform: string;
  status: string;
  train: Array<{
    x: string;
    y: string;
    transform: string;
  }>;
}

export default railwayInterface;
