<script>
	import InputDescription from './InputDescription.vue';
	import InputLabel from './InputLabel.vue';

	import validator from '../../utils/validator';

	export default {
		props: {
			schema: {
				type: Object,
				required: true
			},
			currentValue: true
		},
		components: { InputLabel, InputDescription },
		watch: {
			value: {
				handler: 'update',
				deep: true
			}
		},
		data() {
			const initialValue = typeof this.currentValue !== 'undefined' ? this.currentValue : this.schema.defaultValue;

			return {
				value: typeof initialValue === 'object' ? JSON.parse(JSON.stringify(initialValue)) : initialValue,
				showDescription: false
			};
		},
		computed: {
			defaultValue() {
				return this.schema.defaultValue;
			},
			label() {
				return this.schema.label || this.schema.param || this.schema.paramName;
			},
			field() {
				return this.schema.paramName;
			},
			placeholder() {
				return this.schema.placeholder || this.schema.defaultValue;
			},
			description() {
				return this.schema.description;
			},
			hasDescription() {
				return !!this.description;
			},
			isValid() {
				return !this.hasErrors;
			},
			hasErrors() {
				return this.errors.length;
			},
			errors() {
				if (validator.hasOwnProperty(this.schema.type)) return validator[this.schema.type](this.value, this.schema);
				return [];
			},
			errorText() {
				return this.errors.map(error => `Value is ${error}!`).join(' ');
			}
		},
		methods: {
			update() {
				const value = typeof this.value === 'object' ? JSON.parse(JSON.stringify(this.value)) : this.value;
				this.$emit('update', value, this.field);
			},
			toggleDescription() {
				this.showDescription = !this.showDescription;
			}
		}
	};
</script>
