<template>
    <router-link tag="div" :to="to" class="navigation-link" active-class="navigation-link--active" :exact="true">
        <span class="navigation-link__icon" v-if="icon"><font-awesome-icon :icon="icon" fixed-width></font-awesome-icon></span>
        <span class="navigation-link__name">{{ name }}</span>
    </router-link>
</template>

<script>
    export default {
      props: {
        name: {
          type: String,
          required: true
        },
        to: {
          required: true
        },
        icon: {
          type: String,
          required: true
        }
      },
      name: 'navigation-link'
    }
</script>

<style lang="scss">
    .navigation-link {
        padding: .95em 1.25em;
        width: 100%;
        box-sizing: border-box;
        color: var(--color-text-secondary);
        transition: background .2s;
        cursor: pointer;
        display: flex;
        align-items: center;
        border-left: 3px solid transparent;

        &.navigation-link--active, &:hover {
            background: var(--color-navigation-dark);
            color: var(--color-text);
        }

        &.navigation-link--active {
            border-color: var(--color-theme);
        }

        .app--small-navigation & {
            padding: .95em 0;

            .navigation-link__icon {
                display: inline-flex;
                width: var(--navigation-width);

                > svg {
                    margin: 0 auto;
                }
            }

            .navigation-link__name {
                display: none;
            }

            &:hover {
                position: relative;

                > .navigation-link__name {
                    background: var(--color-navigation-dark);
                    position: absolute;
                    left: calc(var(--navigation-width) - 3px);
                    width: auto;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    padding: 0 1.25em;
                    border-radius: 0 4px 4px 0;
                }
            }
        }

        svg {
            margin-right: 0.5em;
        }
    }
</style>