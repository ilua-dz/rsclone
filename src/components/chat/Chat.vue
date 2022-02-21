<template>
  <div class="chat-window"
  :class="{minimized}"
  >
    <div class="chat-minimize"
    :class="{unread}"
    @click="toggleWindow">
      {{ minimized ? '▲' : '▼' }}
    </div>
    <transition-group tag="ul" class="chat-field" name="slide-up">
      <li class="chat-message"
      :key="index" v-for="(post, index) in getHistory">
      <span class="message-name"
      :class="{'my-name': checkMyName(post.name)}"
      >{{post.name}}</span>: {{ post.message }}
      </li>
    </transition-group>
    <div class="chat-form">
    <input
    type="text"
    class="chat-input"
    v-model="message"
    placeholder="Напиши сообщение..."
    @keydown.enter="sendMessage">
    <Btn
      title="⏎"
      class="btn-accept"
      :method="sendMessage"
          />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Btn from '../Button/Btn.vue';

@Component({
  computed: {
    ...mapGetters([
      'getUsers',
      'getCurrentName',
      'getCompletedLength',
      'getHistory',
      'getId',
    ]),
  },
  components: {
    Btn,
  },
})
export default class Chat extends Vue {
  message = '';

  getCurrentName!:string;

  getId!: string;

  minimized = true;

  unread = false;

  @Watch('getHistory') onHistoryChange(): void {
    if (this.minimized) {
      this.unread = true;
    } else {
      this.unread = true;
      setTimeout(() => {
        this.unread = false;
      }, 800);
    }
  }

  toggleWindow():void {
    this.minimized = !this.minimized;
    this.unread = false;
  }

  checkMyName(name: string): boolean {
    if (name === this.getCurrentName) return true;
    if (name === `Guest_${this.getId[0]}${this.getId[4]}${this.getId[this.getId.length - 1]}`) return true;
    return false;
  }

  sendMessage(): void {
    const name = this.getCurrentName || this.getId;
    this.$socket.emit('sendMessage', { name, message: this.message });
    this.message = '';
  }
}
</script>

<style lang="scss">
.chat-window {
  background-color: antiquewhite;
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 70rem;
  transition: all 0.5s;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  transform: translateX(-50%);
  overflow: hidden;

  &.minimized {
    height: 3rem;
    width: 20%;
    left: 50%;
  }

  .chat-minimize {
    height: 3rem;
    width: 100%;
    cursor: pointer;
    background-color: antiquewhite;
    transition: all 0.5s;

    &.unread {
      animation: pulseUnread 0.4s ease-in-out alternate infinite;
    }
  }
  .chat-form {
    padding: 0 3rem;
    display: flex;
    justify-content: center;
  }
  .chat-input{
    border: 2px solid gray ;
    width: 70rem;
  }
  .chat-field {
    padding: 0 3rem;
    list-style: none;
    max-height: 20rem;
    overflow-y: auto;
  }

  .chat-message {
    font-size: 2rem;
    padding: 0.2rem;
    text-align: left;
    .message-name {
      font-weight: 600;
      font-size: 2.5rem;
    &.my-name {
     color: #00912b;
    }
   }
  }

  .slide-up {
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
    transform: translateY(100%);
    }
  }
}

@keyframes pulseUnread {
  0% {
    background-color: antiquewhite;
  }
  100% {
    background-color: rgb(243, 181, 47);
  }
}

</style>
