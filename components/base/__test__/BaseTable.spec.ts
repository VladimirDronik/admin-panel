import {
  describe, it, expect, vi, beforeAll,
} from 'vitest';
import { mount } from '@vue/test-utils';
import { useRoute } from 'vue-router';
import BaseTable from '../Table.vue';
import { plugins } from '~/test/unit.setup';

vi.mock('vue-router');

describe('BaseTable.vue', () => {
  it('Empty data', () => {
    // @ts-ignore
    useRoute.mockReturnValue({
      query: {},
    });

    const wrapper = mount(BaseTable, {
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
      },
    });

    expect(wrapper.find('[data-test="filters"]').exists()).toBe(false);
    expect(wrapper.findAll('[data-test="filter"]').length).toBe(0);
  });

  it('Testing with data', () => {
    // @ts-ignore
    useRoute.mockReturnValue({
      query: {},
    });

    const wrapper = mount(BaseTable, {
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
      },
    });

    // wrapper.find('[data-test="filter-btn"]').trigger('click');

    expect(wrapper.find('[data-test="filter-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="pagination"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="filters"]').exists()).toBe(true);

    setTimeout(() => {
      expect(wrapper.findAll('[data-test="filter"]').length).toBe(1);
    }, 300);
  });
});
