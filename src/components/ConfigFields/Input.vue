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
      value() {
        this.$emit('update', this.value, this.field);
      }
    },
    data() {
      return {
        value: typeof this.currentValue !== 'undefined' ? this.currentValue : this.schema.defaultValue
      };
    },
    computed: {
      defaultValue() {
        return this.schema.defaultValue;
      },
      label() {
        return this.schema.label || this.schema.paramName;
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
        return;
      }
    },
    methods: {
      validate(value, validator) {
        if (!validator) return [];
        return validator(value, this.schema);
      }
    }
  };
</script>
