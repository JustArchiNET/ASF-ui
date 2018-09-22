<script>
	const descriptionTypeRegex = new RegExp('.+ type with default value of .+?\\.');
	const descriptionRegex = new RegExp('This property defines');

	export default {
		props: {
			schema: {
				type: Object,
				required: true
			},
			currentValue: true
		},
		watch: {
			value: 'update'
		},
		data() {
			const initialValue = typeof this.currentValue !== 'undefined' ? this.currentValue : this.schema.defaultValue;

			return {
				value: typeof initialValue === 'object' ? JSON.parse(JSON.stringify(initialValue)) : initialValue
			};
		},
		computed: {
			defaultValue() {
				return this.schema.defaultValue;
			},
			label() {
				return this.schema.label || this.schema.param || this.schema.paramName;
			},
			description() {
				if (!this.schema.description) return;

				let description = this.schema.description;

				if (descriptionTypeRegex.test(description)) description = description.replace(descriptionTypeRegex, '').trim();
				if (descriptionRegex.test(description)) description = description.replace(descriptionRegex, '').trim();

				description = description.charAt(0).toUpperCase() + description.substr(1);

				if (description.length < 150) return description;

				const endOfSentenceIndex = description.indexOf('.');
				description = description.slice(0, endOfSentenceIndex);

				return description.length > 150 ? description.slice(0, 147) + '...' : description;
			},
			required() {
				return false;
			},
			field() {
				return this.schema.paramName;
			},
			placeholder() {
				return this.schema.placeholder || this.schema.defaultValue;
			}
		},
		methods: {
			validate(value, validator) {
				if (!validator) return [];
				return validator(value, this.schema);
			},
			update() {
				this.$emit('update', this.value, this.field);
			}
		}
	};
</script>
