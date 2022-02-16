import typeOfCardsColor from './colorType';

interface railwayInfoInterface {
  cities: [string, string],
  color: typeOfCardsColor | 'multi',
  id: string,
  points: number,
  trainsAmount: number,
}

export default railwayInfoInterface;
