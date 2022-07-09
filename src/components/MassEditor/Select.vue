<template>
  <div class="mass-editor">
    <div class="mass-editor__title">
      {{ $t('mass-editor-properties') }}

      <div class="mass-editor__navigation pull-right">
        <button class="button" @click="$emit('back')">
          {{ $t('back') }}
        </button>

        <div v-tooltip.left="nextTitle">
          <!-- https://stackoverflow.com/questions/53748739/v-tooltip-stops-working-when-element-is-disabled -->
          <button class="button" :disabled="isNextDisabled" @click="$emit('next')">
            {{ $t('next') }}
          </button>
        </div>
      </div>
    </div>

    <div class="mass-editor__content">
      <Multiselect
        v-model="selection"
        v-bind="multiselectConfig"
        @select="selectOption"
        @remove="removeOption"
        @input="updateModel"
        @open="openSelection"
        @close="closeSelection"
      >
        <span slot="noResult">
          {{ $t('mass-editor-search-not-found') }}
        </span>
      </Multiselect>
    </div>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';

  export default {
    name: 'MassEditorSelect',
    components: {
      Multiselect,
    },
    props: {
      loading: { type: Boolean, required: true },
      options: { type: Array, required: true },
      selectedProperties: { type: Array, required: true },
    },
    data() {
      return {
        selection: this.selectedProperties,
        multiselectConfig: {
          label: 'param',
          trackBy: 'param',
          loading: this.loading,
          multiple: true,
          options: this.options,
          closeOnSelect: false,
          placeholder: '',
          deselectLabel: '',
          selectLabel: '',
          selectedLabel: '',
        },
      };
    },
    computed: {
      nextTitle() {
        return (this.selectedProperties.length === 0) ? this.$t('mass-editor-properties-disabled') : null;
      },
      isNextDisabled() {
        return this.selectedProperties.length === 0;
      },
    },
    methods: {
      selectOption(option) {
        this.$emit('select', option);
      },
      removeOption(option) {
        this.$emit('remove', option);
      },
      updateModel(model) {
        this.$emit('update', model);
      },
      openSelection() {
        this.multiselectConfig.placeholder = this.$t('mass-editor-search');
      },
      closeSelection() {
        this.multiselectConfig.placeholder = '';
      },
    },
  };
</script>

<style lang="scss">
  @import "../../style/partials/multiselect";
</style>
