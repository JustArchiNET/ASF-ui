<template>
  <div class="mass-editor">
    <div class="mass-editor__title">
      {{ $t('mass-editor-properties') }}

      <div class="mass-editor__navigation pull-right">
        <button class="button" @click="$emit('back')">
          {{ $t('back') }}
        </button>

        <button
          class="button"
          :disabled="selectedConfigProperties.length === 0"
          :title="[selectedConfigProperties.length === 0 ? $t('mass-editor-properties-disabled') : null]"
          @click="$emit('next')"
        >
          {{ $t('next') }}
        </button>
      </div>
    </div>

    <div class="mass-editor__content">
      <Multiselect
        v-model="selection"
        label="param"
        trackBy="param"
        :loading="loading"
        :multiple="true"
        :options="options"
        :closeOnSelect="false"
        :placeholder="placeholder"
        :deselectLabel="$t('mass-editor-properties-deselect')"
        :selectLabel="$t('mass-editor-properties-select')"
        :selectedLabel="$t('mass-editor-properties-selected')"
        @select="selectOption"
        @remove="removeOption"
        @input="updateModel"
        @open="placeholder = $t('mass-editor-search')"
        @close="placeholder = $t('mass-editor-properties-placeholder')"
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
      loading: { type: Boolean },
      options: { type: Array },
      selectedConfigProperties: { type: Array },
    },
    data() {
      return {
        selection: this.selectedConfigProperties,
        placeholder: this.$t('mass-editor-properties-placeholder'),
      };
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
    },
  };
</script>

<style lang="scss">
  @import "../../style/partials/multiselect";
</style>
