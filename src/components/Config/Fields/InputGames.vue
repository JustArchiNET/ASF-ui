<template>
  <div class="form-item">
    <input-label :label="label" :hasDescription="hasDescription"></input-label>

    <div class="form-item__value">
      <Multiselect
        v-bind="{
          value: null,
          trackBy: 'appid',
          customLabel: resolveOption,
          options,
          optionsLimit: 100,
          internalSearch: false,
          loading,
          closeOnSelect: true,
          placeholder: $t('input-games-placeholder'),
          deselectLabel: '',
          selectLabel: '',
          selectedLabel: ''
        }"
        @open="loadGames"
        @search-change="onSearchChange"
        @select="addElement"
      >
        <template #noResult>{{ $t('input-games-no-result') }}</template>
        <template #noOptions>{{ $t('input-games-no-result') }}</template>
      </Multiselect>

      <span v-if="unavailable" class="form-item__hint">{{ $t('input-games-unavailable') }}</span>

      <div class="input-option__items">
        <button v-for="appid in value" :key="appid" class="button input-option__item" @click.prevent="removeElement(appid)">
          {{ resolveOption({ appid, name: gameNames[appid] }) }}
        </button>
      </div>
    </div>

    <input-description v-if="hasDescription" v-show="showDescription" :description="description"></input-description>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import Input from './Input.vue';
  import validator from '../../../utils/validator';
  import parseOwnedGames from '../../../utils/parseOwnedGames';

  export default {
    name: 'InputGames',
    components: {
      Multiselect,
    },
    mixins: [Input],
    data() {
      return {
        games: [],
        search: '',
        loading: false,
        unavailable: false,
      };
    },
    computed: {
      gameNames() {
        const gameNames = {};
        this.games.forEach(game => { gameNames[game.appid] = game.name; });
        return gameNames;
      },
      options() {
        const query = this.search.trim().toLowerCase();
        const games = this.games.filter(game => !this.value.includes(game.appid));

        if (!query) return games;

        const options = games.filter(game => game.name.toLowerCase().includes(query) || `${game.appid}`.includes(query));

        // Any valid appID can be added, even if it is not part of the library
        if (!/^\d+$/.test(query) || validator.uint32(query).length) return options;

        const appid = parseInt(query, 10);
        if (this.value.includes(appid)) return options;

        const exactOption = options.find(game => game.appid === appid) || { appid };
        return [exactOption, ...options.filter(game => game !== exactOption)];
      },
    },
    methods: {
      async loadGames() {
        if (this.loading || this.games.length) return;

        this.loading = true;

        try {
          const response = await this.$http.command('owns', this.schema.botName, 'regex/.');
          const games = parseOwnedGames(response, this.schema.botName);

          this.games = Object.freeze(games.sort((a, b) => a.name.localeCompare(b.name)));
          this.unavailable = !games.length;
        } catch (err) {
          // Bot is most likely offline, adding games by appID still works
          this.unavailable = true;
        } finally {
          this.loading = false;
        }
      },
      resolveOption({ appid, name }) {
        if (!name) return `${appid}`;
        return `${name} (${appid})`;
      },
      onSearchChange(search) {
        this.search = search;
      },
      addElement({ appid }) {
        if (this.value.includes(appid)) return;
        this.value.push(appid);
      },
      removeElement(appid) {
        this.value.splice(this.value.indexOf(appid), 1);
      },
    },
  };
</script>

<style lang="scss">
  @import "../../../style/partials/multiselect";

  .form-item__hint {
    color: var(--color-text-dark);
    display: block;
    font-size: 0.85em;
    margin-top: 0.25em;
  }
</style>
