import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BaseCard from '../Card.vue';
import { plugins } from '@/test/unit.setup';

describe('BaseCard.vue', () => {
  it('Default title page', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.find('[data-test="title"]').exists()).toBe(false);
  });

  it('Displaying the Title', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        title: 'Billing',
      },
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.find('[data-test="title"]').exists()).toBe(true);

    expect(wrapper.text()).toContain('Billing');
  });
});
