<script>
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
        return this.schema.description;
      },
      required() {
        return false;
      },
      field() {
        return this.schema.paramName;
      },
      placeholder() {
        return this.schema.defaultValue;
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
