import userInterface from '@/components/interface/user';
import railwayInterface from '@/components/interface/railway';
import railwayInfoInterface from '@/components/interface/railwayInfo';
import ICity from '@/components/interface/ICity';
import railwaysInfo from './railwaysInfo';

export default {
  state: {
    railways: [],
    cities: [],
    railwaysInfo,
  },
  mutations: {
    SOCKET_createApp(
      state: { railways: railwayInterface[], cities: ICity[]},
      data: {
        users: userInterface[];
        gameStatus: boolean;
        railways: railwayInterface[];
        cities: ICity[]
      },
    ): void {
      state.railways = data.railways;
      state.cities = data.cities;
    },

    SOCKET_setRailwayStatus(
      state: { railways: railwayInterface[] },
      data: { path: string, currentName: string },
    ): void {
      const currentWay = state.railways.find((way) => way.id === data.path);
      if (currentWay) {
        currentWay.status = data.currentName;
      }
    },

    SOCKET_setCityStatus(
      state: { cities: ICity[] },
      data: { cityId: number, currentName: string },
    ): void {
      const currentCity = state.cities.find((c) => c.id === data.cityId);
      if (currentCity) {
        currentCity.status = data.currentName;
      }
    },
  },
  getters: {
    getRailways: (state: { railways: railwayInterface[] }): railwayInterface[] => state.railways,

    getCities: (state: { cities: ICity[] }): ICity[] => state.cities,

    getRailwaysInfo: (state:
      { railwaysInfo: railwayInfoInterface[] }): railwayInfoInterface[] => state.railwaysInfo,
  },
};
