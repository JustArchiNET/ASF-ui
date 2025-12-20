import { mount } from "@vue/test-utils";
import BotCopy from "../views/modals/BotCopy.vue";
import Bot2FADelete from "../views/modals/Bot2FADelete.vue";

describe("BotCopy.vue", () => {
  it("renders the component", () => {
    const wrapper = mount(BotCopy, {
      global: {
        mocks: {
          $t: key => key,
          $i18n: { locale: "en" }
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});

describe("Bot2FADelete.vue", () => {
  it("renders the component", () => {
    const wrapper = mount(BotCopy, {
      global: {
        mocks: {
          $t: key => key,
          $i18n: { locale: "en" }
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
