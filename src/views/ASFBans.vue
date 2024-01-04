<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <div class="form-item">
        <div class="form-item__buttons">
          <button class="button button--small" :disabled="loading" @click="refresh()">
            <FontAwesomeIcon v-if="loading" icon="spinner" spin></FontAwesomeIcon>
            <span v-else>{{ $t('asf-bans-refresh') }}</span>
          </button>
          <button v-if="bannedIps.length" class="button button--small pull-right" @click="removeBan()">
            <FontAwesomeIcon v-if="removingAll" icon="spinner" spin></FontAwesomeIcon>
            <span v-else>{{ $t('asf-bans-remove-all') }}</span>
          </button>
        </div>
      </div>

      <h3 v-if="loading" class="subtitle">
        <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
      </h3>

      <p v-else-if="!bannedIps.length" class="subtitle">{{ $t('asf-bans-empty') }}</p>

      <div v-else class="asf-bans">
        <div v-for="bannedIp in bannedIps" :key="bannedIp" class="ban">
          <p class="ban__ip">{{ bannedIp }}</p>
          <div class="ban__buttons pull-right">
            <span v-tooltip="$t('asf-bans-copy')" class="ban__button" @click="copyIp(bannedIp)">
              <FontAwesomeIcon icon="clipboard"></FontAwesomeIcon>
            </span>
            <span v-tooltip="$t('asf-bans-remove')" class="ban__button" @click="removeBan(bannedIp)">
              <FontAwesomeIcon v-if="removing === bannedIp" icon="spinner" spin></FontAwesomeIcon>
              <FontAwesomeIcon v-else icon="trash"></FontAwesomeIcon>
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import * as copy from 'copy-to-clipboard';

  export default {
    name: 'ASFBans',
    metaInfo() {
      return {
        title: this.$t('asf-bans'),
      };
    },
    data() {
      return {
        loading: false,
        removing: false,
        removingAll: false,
        bannedIps: [],
      };
    },
    created() {
      this.refresh();
    },
    methods: {
      copyIp(ip) {
        copy(ip);
        this.$info(this.$t('asf-bans-copied'));
      },
      async removeBan(bannedIp = null) {
        if (this.removing || this.removingAll) return;

        if (bannedIp) this.removing = bannedIp;
        else this.removingAll = true;

        try {
          const endpoint = (bannedIp) ? `ipc/bans/${bannedIp}` : 'ipc/bans';
          await this.$http.del(endpoint);

          if (bannedIp) this.$success(this.$t('asf-bans-deleted', { ip: bannedIp }));
          else this.$success(this.$t('asf-bans-deleted-all'));

          this.refresh();
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.removing = false;
          this.removingAll = false;
        }
      },
      async refresh() {
        if (this.loading) return;
        this.loading = true;

        try {
          this.bannedIps = await this.$http.get('ipc/bans');
        } catch (err) {
          this.$error(err.message);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style lang="scss">
  .asf-bans {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    min-height: 0;

    @media screen and (max-width: 1366px) {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    @media screen and (max-width: 400px) {
      grid-template-columns: 1fr;
    }

    .ban {
      background: var(--color-background-modal);
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5em;

      &__ip {
        margin: 0;
        font-size: larger;
      }

      &__buttons {
        display: flex;
      }

      &__button {
        color: var(--color-text-disabled);
        cursor: pointer;
        display: block;
        padding: 0.5em;
        transition: color 0.3s;
      }
    }
  }
</style>
