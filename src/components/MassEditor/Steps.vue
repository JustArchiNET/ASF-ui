<template>
  <ul class="wizard">
    <li v-for="(step, i) in steps" :key="step" :class="{ active: currentStep === step }" class="wizard__step">
      <div v-tooltip.bottom="getDisabledTitle(step)" class="wizard__step-wrapper" :class="{ disabled: isStepDisabled(step) }" @click="setStep(step)">
        <div class="wizard__step-number">{{ i+1 }}</div>
        <span class="wizard__step-name">{{ step }}</span>
      </div>
      <div v-if="i !== 0" class="wizard__step-line"></div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'MassEditorSteps',
    props: {
      steps: { type: Array, required: true },
      currentStep: { type: String, required: true },
      isDisabled: { type: Function, required: true },
      getTitle: { type: Function, required: true },
    },
    methods: {
      setStep(step) {
        if (!this.isStepDisabled(step)) this.$emit('setStep', step);
      },
      isStepDisabled(step) {
        return this.isDisabled(step);
      },
      getDisabledTitle(step) {
        return this.getTitle(step);
      },
    },
  };
</script>

<style lang="scss">
  .wizard {
    display: flex;
    padding: 0;
    margin: 1em;
    margin-top: 0.5em;

    @media screen and (max-width: 460px) {
      margin: 0.5em 0 1em 0;
    }
  }

  .wizard__step {
    flex: 1;
    list-style: none;
    position: relative;
    text-align: center;
    z-index: 10;

    &.active {
      color: var(--color-theme);
    }
  }

  .wizard__step-wrapper {
    width: 50%;
    margin: 0 auto;
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed !important;
    }

    &:hover {
      color: var(--color-theme);
    }
  }

  .wizard__step-number {
    background: var(--color-background-modal);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    line-height: 32px;
    border: 2px solid var(--color-background-modal);
    display: block;
    text-align: center;
    margin: 0 auto 0.75em auto;
    font-size: 18px;

    @media screen and (max-width: 460px) {
      width: 24px;
      height: 24px;
      line-height: 24px;
      font-size: 16px;
    }
  }

  .wizard__step-name {
    text-transform: uppercase;
  }

  .wizard__step-line {
    width: 100%;
    height: 2px;
    content: "";
    position: absolute;
    background-color: var(--color-background-modal);
    top: 18px;
    left: -45%;
    z-index: -1;

    @media screen and (max-width: 460px) {
      top: 14px;
    }
  }
</style>
