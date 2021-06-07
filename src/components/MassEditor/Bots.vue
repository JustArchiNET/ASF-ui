<template>
  <div class="mass-editor">
    <div class="mass-editor__title">
      {{ $t('mass-editor-bots') }}

      <div class="mass-editor__navigation pull-right">
        <button
          class="button"
          :disabled="selectedBots.length === 0"
          :title="[selectedBots.length === 0 ? $t('mass-editor-bots-disabled') : null]"
          @click="$emit('next')"
        >
          {{ $t('next') }}
        </button>
      </div>
    </div>

    <div class="mass-editor__content">
      <BotsView
        :selectedBotNames="selectedBotNames"
        :selectable="selectable"
        :bots="bots"
        @update="update"
      ></BotsView>

      <button class="button mt" @click="$emit('toggle')">
        <span v-if="selectedBots.length === bots.length">{{ $t('mass-editor-bots-deselect') }}</span>
        <span v-else>{{ $t('mass-editor-bots-select') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
  import BotsView from './partials/BotsView.vue';

  export default {
    name: 'MassEditorBots',
    components: {
      BotsView,
    },
    props: {
      selectedBots: { type: Array },
      selectable: { type: Boolean, default: true },
      bots: { type: Array },
    },
    computed: {
      selectedBotNames() {
        return this.selectedBots.map(bot => bot.name);
      },
    },
    methods: {
      update(bot) {
        this.$emit('update', bot);
      },
    },
  };
</script>

<style lang="scss">
  .mt {
      margin-top: 1em;
    }
</style>
