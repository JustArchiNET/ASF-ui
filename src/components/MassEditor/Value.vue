<template>
  <div class="mass-editor">
    <div class="mass-editor__title">
      {{ $t('mass-editor-values', { n: selectedConfigProperties.length }) }}

      <div class="mass-editor__navigation pull-right">
        <button class="button" @click="$emit('back')">
          {{ $t('back') }}
        </button>

        <button class="button" @click="$emit('next')">
          {{ $t('next') }}
        </button>
      </div>
    </div>

    <div class="mass-editor__content">
      <ConfigEditor
        :fields="selectedConfigProperties"
        :categories="displayCategories ? categories : null"
        :model="config"
        :deleteDefaultValues="false"
      ></ConfigEditor>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ConfigEditor from '../ConfigEditor.vue';

  export default {
    name: 'MassEditorSelect',
    components: {
      ConfigEditor,
    },
    props: {
      config: { type: Object },
      categories: { type: Array },
      selectedConfigProperties: { type: Array },
    },
    computed: {
      ...mapGetters({
        displayCategories: 'settings/displayCategories',
      }),
    },
  };
</script>
