<template>
  <main v-if="bot" class="main-container">
    <h2 v-if="bot.nickname && nicknames" class="title">{{ bot.nickname }}</h2>
    <h2 v-else class="title">{{ bot.name }}</h2>

    <h3 v-if="loading" class="subtitle">
      <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
    </h3>

    <BgrStatus v-if="!loading && state === 'input'" :used-keys="usedKeys" :unused-keys="unusedKeys" @reset="showReset" @show-unused="state = 'unusedKeys'" @show-used="state = 'usedKeys'"></BgrStatus>

    <div v-if="!loading && state === 'input' && bot.bgrCount !== 0" class="bgr__info">
      <div v-if="bot.isConnected" class="bgr__info-icon">
        <FontAwesomeLayers class="hourglass-spin">
          <FontAwesomeIcon icon="hourglass-start"></FontAwesomeIcon>
          <FontAwesomeIcon icon="hourglass-half"></FontAwesomeIcon>
          <FontAwesomeIcon icon="hourglass-end"></FontAwesomeIcon>
          <FontAwesomeIcon icon="hourglass-end" spin></FontAwesomeIcon>
        </FontAwesomeLayers>
      </div>
      <p class="subtitle">{{ backgroundQueueText }}</p>
    </div>

    <keep-alive>
      <BgrInput v-if="state === 'input'" @check="onCheck"></BgrInput>
      <BgrCheck v-if="state === 'check'" :keys="keys" :title="$t('bgr-check', { n: foundKeysCount })" :bot="bot" :confirming="confirming" @confirm="onConfirm" @cancel="onCancel"></BgrCheck>
      <BgrReset v-if="state === 'reset'" :title="$t('bgr-reset')" :resetting="resetting" @reset="onReset" @cancel="onCancel"></BgrReset>
      <BgrSummary v-if="state === 'summary'" :keys="summaryKeys" :title="$t('bgr-summary-success', { n: addedKeysCount })" @back="$parent.back()"></BgrSummary>
      <BgrSummary v-if="state === 'usedKeys'" :keys="usedKeys" :title="$t('bgr-used-keys')" @back="state = 'input'"></BgrSummary>
      <BgrSummary v-if="state === 'unusedKeys'" :keys="unusedKeys" :title="$t('bgr-unused-keys')" @back="state = 'input'"></BgrSummary>
    </keep-alive>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BgrCheck from '../../components/BGR/Check.vue';
  import BgrInput from '../../components/BGR/Input.vue';
  import BgrReset from '../../components/BGR/Reset.vue';
  import BgrStatus from '../../components/BGR/Status.vue';
  import BgrSummary from '../../components/BGR/Summary.vue';

  export default {
    name: 'BotBgr',
    components: {
      BgrCheck, BgrInput, BgrReset, BgrStatus, BgrSummary,
    },
    data() {
      return {
        loading: true,
        confirming: false,
        resetting: false,
        state: 'input',
        unusedKeys: {},
        usedKeys: {},
        keys: {},
        summaryKeys: {},
      };
    },
    computed: {
      ...mapGetters({ nicknames: 'settings/nicknames' }),
      bot() {
        return this.$store.getters['bots/bot'](this.$route.params.bot);
      },
      foundKeysCount() {
        return Object.keys(this.keys).length;
      },
      addedKeysCount() {
        return Object.keys(this.summaryKeys).length;
      },
      backgroundQueueText() {
        const text = this.$t('bgr-background-queue', { n: this.bot.bgrCount });
        return (this.bot.isConnected) ? `${text}..` : text;
      },
    },
    watch: {
      $route: {
        immediate: true,
        async handler() {
          this.loading = true;
          const { UnusedKeys, UsedKeys } = await this.loadBGR();
          this.unusedKeys = UnusedKeys;
          this.usedKeys = UsedKeys;
          this.loading = false;
        },
      },
    },
    created() {
      if (!this.bot) this.$router.replace({ name: 'bots' });
    },
    methods: {
      async loadBGR() {
        return (await this.$http.get(`bot/${this.bot.name}/gamesToRedeemInBackground`))[this.bot.name];
      },
      onCheck(keys) {
        this.keys = keys;
        this.state = 'check';
      },
      async onConfirm() {
        this.confirming = true;

        try {
          const activatedKeys = await this.$http.post(`bot/${this.bot.name}/gamesToRedeemInBackground`, { gamesToRedeemInBackground: this.keys });
          this.state = 'summary';
          this.summaryKeys = activatedKeys[this.bot.name];
        } finally {
          this.confirming = false;
        }
      },
      onCancel() {
        this.state = 'input';
      },
      showReset() {
        this.state = 'reset';
      },
      async onReset() {
        this.resetting = true;

        try {
          await this.$http.del(`bot/${this.bot.name}/gamesToRedeemInBackground`);
          this.unusedKeys = {};
          this.usedKeys = {};
        } finally {
          this.resetting = false;
          this.state = 'input';
        }
      },
    },
  };
</script>

<style lang="scss">
	.bgr__info {
		align-items: center;
		display: flex;
		justify-content: center;
	}

	.bgr__info-icon {
		padding-right: 0.5em;
	}

	.hourglass-spin {
		[class*="fa-hourglass"] {
			animation: showHide 4s steps(1) infinite;
			opacity: 0;
		}

		.fa-hourglass-half {
			animation-delay: 1s;
		}
		.fa-hourglass-start {
			animation-delay: 0s;
		}
		.fa-hourglass-end {
			animation-delay: 2s;
		}

		.fa-hourglass-end.fa-spin {
			animation: showHideSpin 4s linear infinite;
		}
	}

	@keyframes showHide {
		0% { opacity: 1 }
		25% { opacity: 0 }
	}

	@keyframes showHideSpin {
		0% { opacity: 0 }
		74.99% { opacity: 0 }
		75% { opacity: 1; transform: rotate(0deg); }
		100% { opacity: 1; transform: rotate(180deg); }
	}
</style>
