<template>
	<div class="form-item">
		<input-label :label="label" :has-description="hasDescription"></input-label>

		<div class="form-item__value">
			<div class="form-item__input form-item__input--tag-wrapper" :class="{ 'form-item__input--focus': focus }">
				<button v-for="(item, index) in value" class="form-item__tag" @click.prevent="removeElement(index)">
					<span class="form-item__tag-value">{{ item }}</span>
					<font-awesome-icon class="form-item__tag-remove" icon="times"></font-awesome-icon>
				</button>
				<input class="form-item__input form-item__input--tag" type="text" @keydown="onKeyDown" @focus="onFocus" @blur="onBlur" v-model="element">
			</div>
			<span v-if="hasErrors" class="form-item__error">{{ errorText }}</span>
		</div>

		<input-description :description="description" v-if="hasDescription" v-show="showDescription"></input-description>
	</div>
</template>

<script>
	import Input from './Input.vue';
	import validator from '../../utils/validator';

	export default {
		mixins: [Input],
		name: 'input-tag',
		computed: {
			isString() {
				return ['string', 'uint64'].includes(this.schema.values.type);
			},
			isNumber() {
				return ['uint32', 'uint16'].includes(this.schema.values.type);
			},
			errors() {
				if (validator.hasOwnProperty(this.schema.values.type)) return validator[this.schema.values.type](this.element);
				return [];
			},
			isValid() {
				return true;
			}
		},
		data() {
			return {
				focus: false,
				element: ''
			};
		},
		methods: {
			addElement() {
				if (this.hasErrors) return;

				const element = this.isNumber ? parseInt(this.element, 10) : this.element;

				if (!element && element !== 0) return;
				if (this.value.includes(element)) return;

				this.value.push(element);
				this.element = '';
			},
			removeElement(index) {
				this.value.splice(index, 1);
				this.element = '';
			},
			onKeyDown($event) {
				const charCode = ($event.which) ? $event.which : $event.keyCode;

				if ([9, 13].includes(charCode)) {
					this.addElement();
					return $event.preventDefault();
				}

				if (charCode === 8 && (!this.element || !this.element.length)) {
					this.value.splice(-1);
					return $event.preventDefault();
				}

				if (this.isNumber) {
					if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) return $event.preventDefault();
					return true;
				}
			},
			onFocus() {
				this.focus = true;
			},
			onBlur() {
				this.focus = false;
			}
		}
	};
</script>
