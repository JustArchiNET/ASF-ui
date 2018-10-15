<script>
	import InputDescription from './InputDescription.vue';
	import InputLabel from './InputLabel.vue';

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
			value: 'update'
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
			}
		},
		methods: {
			validate(value, validator) {
				if (!validator) return [];
				return validator(value, this.schema);
			},
			update() {
				this.$emit('update', this.value, this.field);
			},
			toggleDescription() {
				this.showDescription = !this.showDescription;
			}
		}
	};
</script>
