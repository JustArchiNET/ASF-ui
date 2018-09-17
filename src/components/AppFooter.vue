<template>
    <footer class="footer">
        <div class="footer__links">
            <a class="footer__link" target="_blank" href="https://github.com/JustArchi/ArchiSteamFarm">GitHub</a>
            <a class="footer__link" target="_blank" href="https://github.com/JustArchi/ArchiSteamFarm/wiki">Wiki</a>
            <a class="footer__link" v-if="validPassword" target="_blank" :href="`https://github.com/JustArchi/ArchiSteamFarm/releases/tag/${version}`">Changelog</a>
        </div>

        <div class="footer__statistics" v-if="validPassword">
            <span class="footer__statistic"><b>Version</b> {{ version }} - {{ buildVariant }}</span>
        </div>
    </footer>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'app-footer',
    computed: mapGetters({
      validPassword: 'auth/validPassword',
      version: 'status/version',
      buildVariant: 'status/buildVariant'
    })
  };
</script>

<style lang="scss">
    .footer {
        grid-area: footer;
        width: 100%;
        height: var(--navigation-height);
        background: var(--color-background-light);
        border-top: 1px solid var(--color-border);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        font-size: 0.9em;
        padding: 0 0.5em;
    }

    .footer__links {
        display: flex;
        height: 100%;
    }

    .footer__link {
        color: var(--color-theme);
        font-weight: 700;
        text-decoration: none;
        height: 100%;
        padding: 0 0.5em;
        margin: 0 0.5em;
        display: flex;
        align-items: center;
    }

    .footer__statistics {
        padding: 0 1em;
        margin-left: auto;
    }
</style>