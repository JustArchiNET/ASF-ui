<template>
  <transition name="modal" duration="200" appear>
    <div v-if="isShown" class="modal">
      <div class="modal__background" @click.self="close"></div>
      <div class="modal__body">
        <font-awesome-icon icon="times" class="modal__close" @click="close"></font-awesome-icon>
        <font-awesome-icon v-if="showArrows" icon="chevron-left" class="modal__arrow left" @click="next('left')"></font-awesome-icon>
        <font-awesome-icon v-if="showArrows" icon="chevron-right" class="modal__arrow right" @click="next('right')"></font-awesome-icon>
        <div class="modal__main">
          <router-view ref="modal" name="modal"></router-view>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'modal',
    computed: {
      ...mapGetters({
        bots: 'bots/bots',
      }),
      isShown() {
        return !!this.$route.meta.modal;
      },
      showArrows() {
        return !!this.$route.meta.arrows && this.bots.length > 1;
      },
    },
    created() {
      document.addEventListener('keydown', this.onEscapeClick);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.onEscapeClick);
    },
    methods: {
      close() {
        this.$router.push({ name: 'bots' });
      },
      back() {
        this.$router.push(this.$route.path.slice(0, this.$route.path.lastIndexOf('/')));
      },
      onEscapeClick(e) {
        const charCode = (e.which) ? e.which : e.keyCode;

        if (charCode === 27) {
          this.close();
          return e.preventDefault();
        }
      },
      next(direction) {
        const currentIndex = this.bots.findIndex(bot => bot.name === this.$route.params.bot);
        let targetBot;
        if (direction === 'left') targetBot = (currentIndex === 0) ? this.bots[this.bots.length - 1] : this.bots[currentIndex - 1];
        else if (direction === 'right') targetBot = (currentIndex === this.bots.length - 1) ? this.bots[0] : this.bots[currentIndex + 1];
        this.$router.push({ name: this.$route.name, params: { bot: targetBot.name } });
      },
    },
  };
</script>

<style lang="scss">
	.modal {
		align-items: center;
		bottom: 0;
		display: flex;
		justify-content: center;
		left: 0;
		position: fixed;
		right: 0;
		top: 0;
		z-index: 1020;
	}

	.modal__background {
		background: rgba(0, 0, 0, 0.8);
		bottom: 0;
		left: 0;
		position: fixed;
		right: 0;
		top: 0;
		transition: background .2s linear;
	}

	.modal__body {
		position: relative;
		transition: opacity .3s ease-out, transform .3s ease-out;
	}

	.modal__main {
		background: var(--color-background-modal);
		border-radius: 4px;
		box-shadow: 0 0 5px 0 var(--color-border);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		max-height: 80vh;
		max-width: 80vw;
		position: relative;
		z-index: 21;

		> div {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
		}
	}

	.modal__close {
		color: var(--color-text-disabled);
		cursor: pointer;
		font-size: 1.2em;
		position: absolute;
		right: -1.5em;
		top: 0.25em;
	}

	.modal-enter, .modal-leave-to {
		.modal__background {
			background: rgba(#000000, 0);
		}

		.modal__body {
			opacity: 0;
			transform: scale(0.75);
		}
	}

	.modal__arrow {
		color: var(--color-text-disabled);
		cursor: pointer;
		font-size: 1.5em;
		position: absolute;
		top: 50%;

		&.left {
			left: -1em;
		}

		&.right {
			right: -1em;
		}
	}
</style>
