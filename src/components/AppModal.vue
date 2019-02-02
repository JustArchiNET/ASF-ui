<template>
	<transition name="modal" duration="200" appear>
		<div class="modal" v-if="isShown">
			<div class="modal__background" @click.self="close"></div>
			<div class="modal__body">
				<font-awesome-icon icon="times" class="modal__close" @click="close"></font-awesome-icon>
				<div class="modal__main">
					<router-view name="modal" ref="modal"></router-view>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'modal',
		computed: {
			isShown() {
				return !!this.$route.meta.modal;
			}
		},
		created() {
			document.addEventListener('keydown', this.onEscapeClick);
		},
		beforeDestroy() {
			document.removeEventListener('keydown', this.onEscapeClick)
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
			}
		}
	};
</script>

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1020;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal__background {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.8);
		transition: background .2s linear;
	}

	.modal__body {
		transition: opacity .3s ease-out, transform .3s ease-out;
		position: relative;
	}

	.modal__main {
		background: var(--color-background);
		box-shadow: 0 0 5px 0 var(--color-border);
		border-radius: 4px;
		z-index: 21;
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		max-width: 80vw;
		max-height: 80vh;

		> div {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
		}
	}

	.modal__close {
		position: absolute;
		right: -1.5em;
		top: 0.25em;
		font-size: 1.2em;
		color: var(--color-text-disabled);
		cursor: pointer;
	}

	.modal-enter, .modal-leave-to {
		.modal__background {
			background: rgba(#000000, 0);
		}

		.modal__body {
			transform: scale(0.75);
			opacity: 0;
		}
	}
</style>
