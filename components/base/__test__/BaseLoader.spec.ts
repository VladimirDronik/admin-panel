import {
  describe, it, expect, beforeAll,
} from 'vitest';
import { mount } from '@vue/test-utils';
import BaseLoader from '../Loader.vue';
import { plugins } from '~/test/unit.setup';

describe('BaseLoader.vue', () => {
  it('Show Loader', () => {
    const wrapper = mount(BaseLoader, {
      props: {
        isUpdate: true,
      },
      global: {
        plugins: plugins(),
      },
    });

    // expect(wrapper.get('[data-test="loader"]'));
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true);
  });
  it('Hide Loader', () => {
    const wrapper = mount(BaseLoader, {
      props: {
        isUpdate: false,
      },
      global: {
        plugins: plugins(),
      },
    });

    // expect(wrapper.get('[data-test="loader"]'));
    expect(wrapper.find('[data-test="loader"]').exists()).toBe(false);
  });
});
