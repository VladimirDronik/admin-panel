import {
  describe, it, expect, vi,
} from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { useRoute } from 'vue-router';

import BaseTable from '../Table.vue';
import { plugins, components } from '~/test/unit.setup';

vi.mock('vue-router');

describe('BaseTable.vue', () => {
  it('Empty data', async () => {
    // @ts-ignore
    useRoute.mockReturnValue({
      query: {},
    });

    const wrapper = await mountSuspended(BaseTable, {
      props: {
        total: 0,
        items: [],
        perPage: 10,
        headers: [],
        page: 1,
        filters: [],
      },
      emits: ['update:page', 'update:filters', 'created'],
      global: {
        plugins: plugins(),
        components,
      },

    });

    expect(wrapper.find('[data-test="filters"]').exists()).toBe(false);
    expect(wrapper.findAll('[data-test="filter"]').length).toBe(0);
  });

  it('Testing with data', async () => {
    // @ts-ignore
    useRoute.mockReturnValue({
      query: {},
    });

    const wrapper = await mountSuspended(BaseTable, {
      props: {
        total: 11,
        items: [
          {
            name: 'name',
            surname: 'surname',
            email: 'email@gmail.com',
          },
        ],
        perPage: 10,
        headers: [
          {
            text: 'Name',
            value: 'name',
          },
          {
            text: 'Surname',
            value: 'surname',
          },
          {
            text: 'Email',
            value: 'email',
          },
        ],
        page: 1,
        filters: [
          {
            label: 'name',
            key: 'name',
            value: null,
          },
        ],
      },
      emits: ['update:page', 'update:filters', 'update', 'created'],
      global: {
        plugins: plugins(),
        components,
      },
    });

    expect(wrapper.find('[data-test="filters"]').exists()).toBe(false);
    await wrapper.find('[data-test="filter-btn"]').trigger('click');
    expect(wrapper.find('[data-test="filters"]').exists()).toBe(true);
    await wrapper.find('[data-test="filter-btn"]').trigger('click');
    expect(wrapper.find('[data-test="filters"]').exists()).toBe(false);

    expect(wrapper.find('[data-test="filter-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="pagination"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="bar"]').exists()).toBe(true);

    setTimeout(() => {
      expect(wrapper.findAll('[data-test="filter"]').length).toBe(1);
    }, 300);
  });
});
