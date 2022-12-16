<template>
  <div class="mass-editor">
    <div class="mass-editor__title">
      {{ $t('mass-editor-bots') }}

      <div class="mass-editor__navigation pull-right">
        <div v-tooltip.left="nextTitle">
          <!-- https://stackoverflow.com/questions/53748739/v-tooltip-stops-working-when-element-is-disabled -->
          <button class="button" :disabled="isNextDisabled" @click="$emit('next')">
            {{ $t('next') }}
          </button>
        </div>
      </div>
    </div>

    <div class="mass-editor__content">
      <div class="mass-editor__content-controls">
        <button class="button mt pull-right" @click="$emit('toggle')">
          <span>{{ toggleBotsText }}</span>
        </button>
      </div>

      <BotsView
        :selectedBotNames="selectedBotNames"
        :selectable="selectable"
        :bots="bots"
        @update="update"
      ></BotsView>
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
      selectedBots: { type: Array, required: true },
      selectable: { type: Boolean, default: true },
      bots: { type: Array, required: true },
    },
    computed: {
      selectedBotNames() {
        return this.selectedBots.map(bot => bot.name);
      },
      nextTitle() {
        return (this.selectedBots.length === 0) ? this.$t('mass-editor-bots-disabled') : null;
      },
      isNextDisabled() {
        return this.selectedBots.length === 0;
      },
      toggleBotsText() {
        if (this.selectedBots.length === this.bots.length) return this.$t('mass-editor-bots-deselect');
        return this.$t('mass-editor-bots-select');
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
  .mass-editor__content-controls {
    display: flex;
  }

  .mt {
      margin-bottom: 1em;
    }
</style>
