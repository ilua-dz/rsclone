<template>
  <div class="lobby-container">
    <img src="../../public/assets/lobby/logo_.png" alt="Ticket to Ride" class="logo-img" />
    <div class="new-user">
      <transition name="fade" mode="out-in">
        <div v-if="!arrayNames.includes(currentName)" class="input-field" key="edit">
          <h2 class="title">{{ loginTitle }}</h2>
          <div class="input-field">
            <input
              ref="nameInput"
              type="text"
              :placeholder="namePlaceholder"
              v-model="userName"
              @keypress.enter="addNewUser"
            />
            <div class="buttons">
              <button class="btn" @click="addNewUser">Добавить</button>
              <button class="btn" @click="clearInput">Очистить</button>
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
      <ul v-if="users.length !== 0">
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
      </ul>
      <p v-else>Игроков пока нет...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ColorButton from './ColorButton/ColorButton.vue';
import userInterface from './interface/user';
import Storage from './localStorage/storage';
import Btn from './Button/Btn.vue';

const storage = new Storage();

@Component({
  components: {
    'color-button': ColorButton,
    Btn,
  },
})
export default class Lobby extends Vue {
  @Prop({ default: [] }) private users!: userInterface[];

  loginTitle = 'Введите своё имя';

  namePlaceholder = 'Введите своё имя';

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
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  row-gap: 2rem;
  background: url('../../public/assets/lobby/start-page-bg.jpg') center;
}

.logo-img {
  padding-top: 4rem;
}

.lobby,
.new-user {
  color: #221e1d;
  padding: 2.5rem;
  border-radius: 2rem;
  background-color: #eceae0;
  transition: 0.5s;
}

.lobby {
  min-width: 70vw;
}

.new-user {
  height: 18rem;
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
  // width: 800px;
  row-gap: 50px;
  justify-content: center;
  // margin: 10px 0 0 80px;
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

  // .username {
  //   display: inline-block;
  //   margin-left: auto;
  // }
}
.invisible {
  opacity: 0;
  pointer-events: none;
}
</style>
