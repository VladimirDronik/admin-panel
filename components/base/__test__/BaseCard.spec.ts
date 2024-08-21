import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseCard from '../Card.vue';
import { plugins } from '@/test/unit.setup';

describe('BaseCard.vue', () => {
  it('Default title page', () => {
    const wrapper = mount(BaseCard, {
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.text()).toContain('');
  });

  it('Displaying the Title English version', () => {
    const wrapper = mount(BaseCard, {
      props: {
        title: 'Billings',
      },
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.text()).toContain('Billing');
  });
});
