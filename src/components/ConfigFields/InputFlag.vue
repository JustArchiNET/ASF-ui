<template>
	<div class="form-item input-option">
		<input-label :label="label" :has-description="hasDescription" />

		<div class="form-item__value">
			<div class="input-option__field">
				<select :id="field" v-model="flagValue" class="form-item__input">
					<option v-for="(flagValue, name) in flags" v-show="flagValue === 0 || !((value & flagValue) === flagValue)" :value="flagValue">
						{{ name }}
					</option>
				</select>
				<button class="button" @click.prevent="addFlag">
					{{ $t('add') }}
				</button>
			</div>

			<div class="input-option__items">
				<button v-for="i in 32" v-if="value & (1 << i)" class="button input-option__item" @click.prevent="removeFlag(1 << i)">
					{{ resolveFlagName(1 << i) }}
				</button>
			</div>
		</div>

		<input-description v-if="hasDescription" v-show="showDescription" :description="description" />
	</div>
</template>

<script>
	import Input from './Input.vue';

	export default {
		name: 'input-flag',
		mixins: [Input],
		data() {
			return {
				flagValue: this.schema.defaultValue
			};
		},
		computed: {
			flags() {
				return this.schema.values;
			}
		},
		methods: {
			addFlag() {
				if (!this.flagValue && this.flagValue !== 0) return;

				if (this.flagValue === 0) this.value = 0;
				this.value |= this.flagValue;
				this.flagValue = this.schema.defaultValue;
			},
			removeFlag(value) {
				this.value &= ~value;
			},
			resolveFlagName(value) {
				return Object.keys(this.flags).find(key => this.flags[key] === value);
			}
		}
	};
</script>
