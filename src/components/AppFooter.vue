<template>
    <footer class="footer">
        <a class="footer__link" target="_blank" href="https://github.com/JustArchi/ArchiSteamFarm">GitHub</a>
    </footer>
</template>

<script>
  export default {
    name: 'app-footer'
  };
</script>

<style lang="scss">
    .footer {
        width: 100%;
        height: var(--navigation-height);
        background: white;
        border-top: 1px solid var(--color-border);
        box-sizing: border-box;
        display: flex;
        align-items: center;
    }

    .footer__link {
        color: var(--color-main);
        font-weight: 700;
        text-decoration: none;
        height: 100%;
        padding: 0 0.5em;
        margin: 0 1em;
        display: flex;
        align-items: center;
    }
</style>