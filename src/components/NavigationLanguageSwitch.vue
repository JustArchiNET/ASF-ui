<template>
	<div class="navigation__language-switch">
		<div class="navigation__button" @click="open = !open">
			<font-awesome-icon class="navigation__language-icon" icon="language" fixed-width></font-awesome-icon>
		</div>

		<transition name="navigation__language-picker">
			<div class="navigation__language-picker" v-if="open">
				<div class="navigation__language" :class="{ 'navigation__language--active': $i18n.locale === locale }" v-for="locale in $i18n.availableLocales" :key="locale" @click.prevent="changeLocale(locale)">
					<flag :country="getFlagCountry(locale)" :title="locale"></flag>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Flag from './Flag.vue';

	export default {
		name: 'navigation-language-switch',
		components: { Flag },
		data() {
			return {
				open: false
			};
		},
		methods: {
			getFlagCountry(locale) {
				if (locale === 'sr-CS') return 'rs';
				return locale.split('-')[1].toLowerCase();
			},
			displayTranslationStatus() {
				const translationPercent = this.$i18n.translationPercent;

				if (translationPercent === 100) return; // Nothing to do here
				if (translationPercent > 80) return this.$info(this.$t('language-translation-good', { percent: translationPercent.toFixed(2), locale: this.$i18n.locale }));
				if (translationPercent > 40) return this.$info(this.$t('language-translation-medium', { percent: translationPercent.toFixed(2), locale: this.$i18n.locale }));
				return this.$info(this.$t('language-translation-bad', { percent: translationPercent.toFixed(2), locale: this.$i18n.locale }));
			},
			async changeLocale(locale) {
				await this.$i18n.load(locale);
				await this.$i18n.set(locale);
				localStorage.setItem('locale', locale);

				this.displayTranslationStatus();

				this.open = false;
			}
		}
	}
</script>

<style lang="scss">
	.navigation__language-switch {
		position: relative;
		display: flex;
		justify-content: center;
	}

	.navigation__language-icon {
		pointer-events: none;
	}

	.navigation__language-picker {
		display: grid;
		position: absolute;
		top: var(--navigation-height);
		right: 0;
		grid-template-columns: repeat(6, auto);
		background: var(--color-theme);
		padding: 0.5em;
		grid-gap: 0.25em;
		transition: transform .3s;
		transform-origin: top;

		@media screen and (max-width: 600px) {
			grid-template-columns: repeat(5, auto);
		}
	}

	.navigation__language {
		padding: 0.5em;
		border-radius: 4px;
		cursor: pointer;

		&:hover {
			background: var(--color-theme-dark);
		}
	}

	.navigation__language--active {
		background: var(--color-theme-dark);
		box-shadow: inset 0 0 1px 0 var(--color-navigation);
	}

	.navigation__language-picker-enter, .navigation__language-picker-leave-to {
		transform: scaleY(0);
	}
</style>
