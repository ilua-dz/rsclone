<template>
  <div class="lobby">
    <h1>Welcome to Ticket to Ride</h1>
    <div class="newUser" v-if="!arrayNames.includes(currentName)">
      <h2 class="title">{{ loginTitle }}</h2>
      <input
        type="text"
        :placeholder="namePlaceholder"
        v-model="userName"
        @keypress.enter="addNewUser"
      />
      <button class="btn btn-primary" @click="addNewUser">Добавить</button>
    </div>
    <hr />
    <h3>Список игроков:</h3>
    <ul v-if="users.length !== 0">
      <li :key="user.name" v-for="user in users" :class="{ 'my-name': user.name === currentName }">
        <color-button
          :currentColor="user.color"
          :clickable="user.name === currentName"
          :usedColors="usedColors"
          @change-color="setNewColor"
        ></color-button>
        <p>{{ user.name }}</p>
        <button
          v-if="user.name === currentName"
          :class="['btn', !user.ready ? 'btn-not' : 'btn-ready']"
          @click="toggleStatus"
        >
          Ready
        </button>
        <p v-else :class="['status', !user.ready ? 'status-not' : 'status-ready']">
          {{ user.ready ? 'Готов играть!' : 'Еще не готов...' }}
        </p>
      </li>
    </ul>
    <p v-else>Игроков пока нет...</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ColorButton from './ColorButton/ColorButton.vue';
import userInterface from './interface/user';
import Storage from './localStorage/storage';

const storage = new Storage();

@Component({
  components: {
    'color-button': ColorButton,
  },
})
export default class Lobby extends Vue {
  @Prop({ default: [] }) private users!: userInterface[];

  loginTitle = 'Enter your name';

  namePlaceholder = 'Enter your name';

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
}
</script>

<style scoped lang="scss">
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: flex;
  width: 600px;
  gap: 50px;
  justify-content: start;
  margin: 10px 0 0 80px;
  font-weight: bold;
}

.status {
  font-weight: normal;
  &-not {
    color: #555;
  }
  &-ready {
    color: tomato;
  }
}

.my-name {
  color: teal;
}
.btn {
  padding: 3px;
  border-radius: 2px;
  border: 2px solid teal;
  cursor: pointer;

  &-ready {
    background-color: rgb(109, 245, 68);
  }
  &-not {
    background-color: rgb(245, 218, 68);
  }
}
</style>
