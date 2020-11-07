<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <template v-if="loading">
        <h3 class="subtitle">
          <font-awesome-icon icon="spinner" size="lg" spin></font-awesome-icon>
        </h3>
      </template>
      <template v-else>
        <div class="form-item">
          <input-label :label="$t('select config property to change')" :has-description="hasDescription"></input-label>

          <div class="form-item__value">
            <select v-model="selectedConfigValue" class="form-item__input" @change="loadConfigEditor">
              <option v-for="(property, i) in configFields" :key="i">
                {{ property.param }}
              </option>
            </select>
          </div>

          <input-description v-show="showDescription" :description="$t('this is the description')"></input-description>
        </div>

        <config-editor :fields="selectedConfigProperty" :model="configModel"></config-editor>

        <div class="form-item">
          <button class="button button--confirm" @click="onSave">{{ $t('save') }}</button>
        </div>
      </template>
    </div>
  </main>
</template>

<script>
  import ConfigEditor from '../components/ConfigEditor.vue';
  import InputLabel from '../components/ConfigFields/InputLabel.vue';
  import InputDescription from '../components/ConfigFields/InputDescription.vue';

  export default {
    name: 'MassEditor',
    metaInfo() {
      return {
        title: this.$t('mass-editor'),
      };
    },
    components: {
      ConfigEditor,
      InputLabel,
      InputDescription,
    },
    data() {
      return {
        configFields: [],
        configModel: {},
        selectedConfigValue: [],
        hasDescription: true,
        showDescription: false,
        loading: true,
        selectedConfigProperty: [],
      };
    },
    computed: {
      configProperties() {
        return this.configFields.filter(field => field.param);
      },
    },
    async created() {
      // load all config values into configFields
      this.configFields = this.loadConfigFields();
      this.loading = false;
    },
    methods: {
      loadConfigEditor() {
        this.selectedConfigProperty = [this.configFields.find(field => field.param === this.selectedConfigValue)] || [];
      },
      toggleDescription() {
        this.showDescription = !this.showDescription;
      },
      async onSave() {
        // Loop through all selected bots and set the selected config value
        // Add some kind of loading bar with info like "Updated config property 'OnlineStatus' for bot 002 with value '0'"
        console.log(this.selectedConfigValue);
        console.log(this.selectedConfigProperty);
        console.log(this.configFields);
      },
      loadConfigFields() {
        // for now fill with test data
        return [
          {
            defaultValue: true,
            description: '<p><code>bool</code> type with default value of <code>true</code>. This property defines if',
            param: 'AutoRestart',
            paramName: 'AutoRestart',
            type: 'boolean',
          },
          {
            defaultValue: '!',
            description: '<p><code>string</code> type with default value of <code>!</code>. This property specifies',
            param: 'CommandPrefix',
            paramName: 'CommandPrefix',
            type: 'string',
          },
        ];
      },
    },
  };
</script>
