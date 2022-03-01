<template>
  <div class="lobby-container">
    <img src="../../public/assets/lobby/logo_.png" alt="Ticket to Ride" class="logo-img" />
    <div class="new-user">
      <transition name="fade" mode="out-in">
        <div v-if="!arrayNames.includes(currentName)" class="input-field" key="edit">
          <h2 class="title">Добро пожаловать! <br />{{ loginTitle }}</h2>
          <div class="input-field">
            <input
              ref="nameInput"
              type="text"
              :placeholder="namePlaceholder"
              v-model="userName"
              @keypress.enter="addNewUser"
            />
            <div class="buttons">
              <button class="btn" @click="addNewUser(), playBtnSound()">Добавить</button>
              <button class="btn" @click="clearInput(), playBtnSound()">Очистить</button>
            </div>
          </div>
        </div>
        <div v-else class="entered-name" key="ok">
          <h2>Вы в игре под именем</h2>
          <h2 class="current-name">{{ currentName }}</h2>
          <Btn title="Покинуть лобби" class="btn-decline" :method="quitLobby" />
        </div>
      </transition>
    </div>
    <div class="lobby">
      <h3>Список игроков:</h3>
      <transition-group tag="ul" name="slide-down" v-if="users.length !== 0">
        <li
          :key="user.name"
          v-for="user in users"
          :class="{ 'my-name': user.name === currentName }"
        >
          <div class="color-container">
            <color-button
              :currentColor="user.color"
              :clickable="user.name === currentName"
              :usedColors="usedColors"
              @change-color="setNewColor"
            ></color-button>
          </div>
          <p class="username">{{ user.name }}</p>
          <p :class="['status', !user.ready ? 'status-not' : 'status-ready']">
            {{ user.ready ? 'Готов ' : 'Еще не готов...' }}
            <i v-if="user.ready" class="fa-solid fa-badge-check"></i>
          </p>
          <Btn
            :title="!user.ready ? 'Готов!' : 'Не готов!'"
            :class="[
              !user.ready ? 'btn-accept' : 'btn-decline',
              user.name !== currentName ? 'invisible' : '',
            ]"
            :method="toggleStatus"
          />
        </li>
      </transition-group>
      <p v-else>Игроков пока нет...</p>
    </div>
    <div
      v-if="checkResultLength"
      class="result-table"
      :style="{
        maxHeight: displayResult ? '100rem' : '6rem',
      }"
      @click="displayResult = !displayResult"
    >
      <div class="result-table-title">
        <i
          class="fa-solid"
          :class="[
            displayResult ? 'fa-arrow-down-from-dotted-line' : 'fa-arrow-up-from-dotted-line',
          ]"
        ></i>
        <h2>
          Результаты последней игры <span> (Всего сыграно: {{ getCountOfGames }})</span>
        </h2>
        <i
          class="fa-solid"
          :class="[
            displayResult ? 'fa-arrow-down-from-dotted-line' : 'fa-arrow-up-from-dotted-line',
          ]"
        ></i>
      </div>
      <ul class="result-list">
        <li class="result-item">
          <p class="result-num title">Место</p>
          <p class="result-name title">Имя</p>
          <p class="result-points title">Баллы за перегоны</p>
          <p class="result-points title">Баллы за маршруты</p>
          <p class="result-points title">Штрафы за маршруты</p>
          <p class="result-points title">Сумма</p>
        </li>
        <li :key="user.name" v-for="(user, index) in getResult" class="result-item">
          <p class="result-num title">{{ index + 1 }}</p>
          <p class="result-name">{{ user.name }}</p>
          <p class="result-points">{{ user.points }}</p>
          <p class="result-points">{{ user.completedTasksPoints }}</p>
          <p class="result-points">{{ user.incompletedTasksPoints }}</p>
          <p class="result-points">{{ user.score }}</p>
        </li>
      </ul>
    </div>
    <footer class="footer">
      <a href="https://github.com/irnq" target="blank" class="footer-item">irnq</a>
      <a href="https://github.com/ilua-dz" target="blank" class="footer-item">ilua-dz</a>
      <a
        href="https://medium.com/@ilua.dzuin/ticket-to-ride-web-%D1%80%D0%B5%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%BD%D0%B0%D1%81%D1%82%D0%BE%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-%D0%B8%D0%B3%D1%80%D1%8B-85fbe710b131"
        target="blank"
        class="footer-item"
        ><i class="fa-brands fa-medium"></i> <i class="fa-regular fa-square-info"></i
      ></a>
      <a href="https://rs.school/js/" target="blank" class="footer-item rss-logo"></a>
      <p class="footer-item">2022</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ColorButton from './ColorButton/ColorButton.vue';
import userInterface from './interface/user';
import Storage from './localStorage/storage';
import Btn from './Button/Btn.vue';
import resultInterface from './interface/result';
import playSound from '../utils/sounds';

const storage = new Storage();

@Component({
  computed: {
    ...mapGetters(['getUsers', 'getCurrentName', 'getResult', 'getCountOfGames']),
  },
  components: {
    'color-button': ColorButton,
    Btn,
  },
})
export default class Lobby extends Vue {
  @Prop({ default: [] }) private users!: userInterface[];

  getResult!: resultInterface[];

  getCountOfGames!: number;

  loginTitle = 'Введите своё имя';

  namePlaceholder = 'Введите своё имя';

  displayResult = false;

  get checkResultLength(): boolean {
    return this.getResult.length > 0;
  }

  get arrayNames(): string[] {
    return this.users.map((user: userInterface) => user.name);
  }

  get usedColors(): string[] {
    return this.users.map((user: userInterface) => user.color);
  }

  get currentColor(): string {
    let color = this.users.find((u) => u.name === this.currentName)?.color;
    if (!color) color = '';
    return color;
  }

  userName = '';

  userReady = false;

  currentName = storage.data.name;

  mounted(): void {
    if (this.currentName) {
      this.userName = this.currentName;
      this.userReady = this.users.find((u) => u.name === this.userName)?.ready || false;
    }
  }

  addNewUser(): void {
    this.userName = this.userName.trim();
    if (this.userName !== '' && !this.arrayNames.includes(this.userName)) {
      this.currentName = this.userName;
      storage.data.name = this.currentName;
      storage.saveData();
      this.$emit('add-new-user', this.currentName, this.usedColors);
    }
  }

  toggleStatus(): void {
    this.userReady = !this.userReady;
    this.$emit('toggle-status', this.currentName);
  }

  setNewColor(color: string): void {
    storage.data.color = color;
    storage.saveData();
    this.$emit('set-new-color', this.currentName, color);
  }

  quitLobby(): void {
    this.$socket.emit('deleteUser', this.userName);
  }

  clearInput(): void {
    this.userName = '';
    storage.data.name = this.userName;
    storage.saveData();
  }

  playSound = playSound;

  playBtnSound(): void {
    this.playSound('button');
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.lobby-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  row-gap: 2rem;
  background: center / cover no-repeat url('../../public/assets/lobby/start-page-bg.jpg');
}

.logo-img {
  padding-top: 4rem;
}

.lobby,
.new-user,
.result-table {
  color: #221e1d;
  padding: 2.5rem;
  border-radius: 2rem;
  background-color: #eceae0;
  transition: 0.5s;
  box-shadow: var(--any-table-shadow);
  border: 0.7rem outset;
}

.lobby {
  min-width: 70vw;
  max-height: 50rem;
  height: min-content;
  transition: all 0.2s;
}

.new-user {
  padding-top: 1.5rem;
  height: 20rem;
  input {
    padding: 0.5rem;
    text-align: center;
    font-weight: 800;
  }
  .buttons {
    width: 100%;
    display: flex;
    justify-content: space-around;
    * {
      padding: 0.2rem;
    }
  }
}

.input-field,
.entered-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: flex;
  row-gap: 50px;
  justify-content: center;
  font-weight: bold;
  align-items: center;
  * {
    flex-basis: 25%;
  }
}

.status {
  display: block;
  text-align: center;

  &-not {
    color: #555;
  }
  &-ready {
    color: rgb(0, 150, 20);
  }
}

.my-name {
  color: teal;
}
.invisible {
  opacity: 0;
  pointer-events: none;
}
.slide-down {
  &-move {
    transition: all 0.3s;
  }
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease-in-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }
}
.footer {
  width: 100%;
  padding: 0 1%;
  height: 5rem;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(255, 255, 255, 0.1);
  border-top: groove;
  a {
    text-decoration: none;
    color: unset;
  }
  .footer-item {
    margin: 0 2rem;
    line-height: 100%;
    padding: 0.6rem;
    background: white;
    border-radius: 1rem;
    transition: 0.3s;
    cursor: pointer;
    border: 2px black solid;
    &:hover {
      transform: rotate(5deg);
      box-shadow: var(--card-shadow);
    }
    &:active {
      transform: rotate(-5deg);
    }
  }
  .rss-logo {
    margin-left: auto;
    background: center / contain no-repeat
      url('https://rolling-scopes-school.github.io/ilua-dz-JSFE2021Q3/christmas-task/assets/svg/rs_school_js.svg')
      black;
    background-size: 70%;
    filter: invert(100%);
    width: 9rem;
    height: 3.5rem;
    border: 2px white solid;
  }
}
.result-table {
  position: absolute;
  bottom: 6rem;
  overflow: hidden;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 1.6rem;
  cursor: pointer;
  &-title {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
}
.result-list {
  border: double;
}
.result-item {
  display: flex;
}
.result-num,
.result-name,
.result-points {
  display: inline-block;
  padding: 0.5rem 0;
  border: 2px solid black;
  &.title {
    text-shadow: 0 0 0px black, 0 0 1px black;
  }
}
.result-num {
  max-width: 6rem;
}
.result-name {
  min-width: 30rem;
  max-width: 40rem;
}
.result-points {
  width: 17rem;
}
</style>
