<template>
  <main class="main-container main-container--fullheight">
    <div class="container">
      <template v-if="loading">
        <h3 class="subtitle">
          <FontAwesomeIcon icon="spinner" size="lg" spin></FontAwesomeIcon>
        </h3>
      </template>
      <template v-else-if="!bannedIps.length">
        <div class="asf-bans">
          <span>{{ $t('asf-bans-empty') }}</span>
          <div class="form-item">
            <button class="button button--confirm" @click="refresh()">
              <span>{{ $t('asf-bans-refresh') }}</span>
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="asf-bans">
          <div v-for="bannedIp in bannedIps" :key="bannedIp" class="ban">
            <p>IP: {{ bannedIp }}</p>
            <button class="button button--confirm" @click="removeBan(bannedIp)">
              <FontAwesomeIcon v-if="removing" icon="spinner" spin></FontAwesomeIcon>
              <span v-else>{{ $t('asf-bans-remove') }}</span>
            </button>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item__buttons">
            <button class="button button--confirm pull-right" @click="refresh()">
              <span>{{ $t('asf-bans-refresh') }}</span>
            </button>
            <button class="button button--cancel" @click="removeBan()">
              <FontAwesomeIcon v-if="removingAll" icon="spinner" spin></FontAwesomeIcon>
              <span v-else>{{ $t('asf-bans-remove-all') }}</span>
            </button>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<script>
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
      async removeBan(bannedIp = null) {
        if (this.removing || this.removingAll) return;

        if (bannedIp) this.removing = true;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;

    button {
      margin-top: 1em;
    }

    .ban {
      display: flex;
      align-items: center;

      button {
        margin: 1em;
      }
    }
  }
</style>
