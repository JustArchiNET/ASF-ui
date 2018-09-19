<template>
    <main class="main-container">
        <h2 class="title">Global Config</h2>

        <div class="container">
            <config-editor :fields="fields" :model="model" @update="onUpdate"></config-editor>
        </div>
    </main>
</template>

<script>
  import ConfigEditor from '../components/ConfigEditor.vue';

  import { get, post } from '../utils/http';
  import fetchConfigSchema from '../utils/fetchConfigSchema';

  export default {
    name: 'global-config',
    metaInfo: { title: 'Global Config' },
    components: { ConfigEditor },
    data() {
      return {
        fields: [],
        model: {}
      };
    },
    async created() {
      const { GlobalConfig: model } = await get('ASF');
      const schema = await fetchConfigSchema('ArchiSteamFarm.GlobalConfig');
      this.model = model;
      this.fields = Object.keys(schema.body).map(key => schema.body[key]);
    },
    methods: {
      async onUpdate(model) {
        return;
        await post('ASF', { GlobalConfig: model });
      }
    }
  };
</script>