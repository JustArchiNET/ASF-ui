<template>
    <div class="navigation-statistic">
        <div class="left-side">
            <span class="navigation-statistic__icon" v-if="icon"><font-awesome-icon :icon="icon" fixed-width></font-awesome-icon></span>
            <span class="navigation-statistic__name">{{ name }}</span>
        </div>
        <span class="navigation-statistic__value">{{ value }}</span>
    </div>
</template>

<script>
  export default {
    name: 'navigation-statistic',
    props: {
      name: {
        type: String,
        required: true
      },
      value: {
        required: true
      },
      icon: {
        type: String,
        required: true
      }
    }
  };
</script>

<style lang="scss">
    .navigation-statistic {
        padding: .75em 1em;
        text-transform: uppercase;
        font-size: 0.9em;
        color: var(--color-text-disabled);
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: var(--navigation-width);

        .app--small-navigation & {
            padding: .95em 0;

            &:hover {
                background: var(--color-navigation-dark);
                color: var(--color-text);
            }

            .navigation-statistic__name {
                display: none;
            }

            .navigation-statistic__value {
                display: none;
            }

            .navigation-statistic__icon {
                display: inline-flex;
                width: var(--navigation-width);

                > svg {
                    margin: 0 auto;
                }
            }

            &:hover {
                position: relative;
                
                > .navigation-statistic__value {
                    background: var(--color-navigation-dark);
                    position: absolute;
                    left: calc(var(--navigation-width) - 3px);
                    width: 7em;
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

    .left-side {
        justify-content: space-between;
    }
</style>