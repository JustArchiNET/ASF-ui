<template>
    <header class="upper-navigation">

    </header>
</template>

<script>
  export default {
    name: 'app-header'
  };
</script>

<style lang="scss">
    .upper-navigation {
        background: var(--color-main);
        display: flex;
        height: var(--navigation-height);
        position: fixed;
        top: 0;
        width: calc(100% - var(--navigation-width));
        margin-left: var(--navigation-width);
        z-index: 1001;
    }
</style>