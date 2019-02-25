<template>
	<span>
		<slot></slot>
	</span>
</template>

<script>
	// https://github.com/robbeman/vue-fit-text

	export default {
		name: 'fit-text',
		props: {
			targetLineCount: {
				default: 1,
				type: Number
			},
			unit: {
				default: 'em',
				type: String
			},
			min: {
				default: 0.5,
				type: Number
			},
			max: {
				default: 1,
				type: Number
			}
		},
		data() {
			return {
				observer: null
			};
		},
		mounted() {
			this.calculate();
			if ('MutationObserver' in window && this.observer === null) {
				// Create the observer (and what to do on changes...)
				this.observer = new MutationObserver(this.calculate);
				// Setup the observer
				this.observer.observe(
					this.$el,
					{ subtree: true, characterData: true }
				);
			}
		},
		beforeDestroy() {
			// Clean up
			this.observer.disconnect();
		},
		methods: {
			calculate() {
				const element = this.$el;
				// first make it an inline block and set the line height to a fixed pixel value
				element.style.display = 'inline-block';
				element.style.lineHeight = '1px';
				// then keep trying until it fits
				let fontSize = this.max;
				const stepSize = (this.unit === 'px') ? 1 : 0.05;
				element.style.fontSize = fontSize + this.unit;
				while (element.offsetHeight > this.targetLineCount && fontSize > this.min) {
					fontSize -= stepSize;
					element.style.fontSize = fontSize + this.unit;
				}
				// found it!!
				// reset the styles
				element.style.display = null;
				element.style.lineHeight = null;
			}
		}
	};
</script>
