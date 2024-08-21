import {
  describe, it, expect,
} from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BaseLoader from '../Loader.vue';
import { plugins } from '~/test/unit.setup';

describe('BaseLoader.vue', () => {
  it('Show Loader', async () => {
    const wrapper = await mountSuspended(BaseLoader, {
      props: {
        isUpdate: true,
      },
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(true);
  });
  it('Hide Loader', async () => {
    const wrapper = await mountSuspended(BaseLoader, {
      props: {
        isUpdate: false,
      },
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.find('[data-test="loader"]').exists()).toBe(false);
  });
});
