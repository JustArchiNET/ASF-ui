<template>
    <div class="brand">
        <span class="logo logo--small"><b>A</b>SF</span>
        <span class="logo logo--big"><b>Archi</b>SteamFarm</span>
    </div>
</template>

<script>
    export default {
      name: 'navigation-brand'
    }
</script>

<style lang="scss">
    .brand {
        padding: 0 1em;
        background: var(--color-main-dark);
        width: var(--navigation-width);
        color: var(--color-text);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        height: var(--navigation-height);

        .logo {
            font-size: 1.25em;
        }

        .logo--small {
            display: none;
        }
    }
</style>