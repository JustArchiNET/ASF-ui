<template>
  <router-link
    :to="to"
    :href="$router.resolve(to).href"
    class="navigation-link"
    :class="[`navigation-link--${level}`]"
    activeClass="navigation-link--active"
    :exact="true"
  >
    <span v-if="icon" class="navigation-link__icon"
      ><FontAwesomeIcon :icon="icon" fixedWidth></FontAwesomeIcon
    ></span>
    <span class="navigation-link__name">{{ name }}</span>
  </router-link>
</template>

<script>
export default {
  name: "NavigationLink",
  props: {
    name: {
      required: true,
      type: String,
    },
    to: {
      required: true,
      type: Object,
    },
    icon: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      zoomLevel: 0,
    };
  },
  computed: {
    level() {
      if (this.zoomLevel > 261 && this.zoomLevel < 320) return "small";
      if (this.zoomLevel > 321 && this.zoomLevel < 440) return "xsmall";
      return "default";
    },
  },
  mounted() {
    window.addEventListener("resize", this.setZoomLevel);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setZoomLevel);
  },
  methods: {
    setZoomLevel() {
      this.zoomLevel = Math.round(window.devicePixelRatio * 100);
    },
  },
};
</script>

<style lang="scss">
.navigation-link {
  align-items: center;
  border-left: 3px solid transparent;
  box-sizing: border-box;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  text-decoration: none;
  transition: background 0.2s;
  white-space: nowrap;
  width: 100%;

  &.navigation-link--active,
  &:hover {
    background: var(--color-navigation-dark);
    color: var(--color-text);
  }

  &.navigation-link--active {
    border-color: var(--color-theme);
  }

  &.navigation-link--default {
    padding: 0.95em 1.25em;
  }

  &.navigation-link--small {
    padding: 0.8em 1.25em;
  }

  &.navigation-link--xsmall {
    padding: 0.7em 1.25em;
  }

  .app--small-navigation & {
    padding: 0.95em 0;

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
        align-items: center;
        background: var(--color-navigation-dark);
        border-radius: 0 4px 4px 0;
        display: flex;
        height: 100%;
        left: calc(var(--navigation-width) - 3px);
        padding: 0 1.25em;
        position: absolute;
      }
    }
  }

  svg {
    margin-right: 0.5em;
  }
}

.navigation-link__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
