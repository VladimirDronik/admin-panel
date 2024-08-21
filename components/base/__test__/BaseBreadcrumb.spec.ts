import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseBreadcrumb from '../Breadcrumb.vue';
import { plugins } from '@/test/unit.setup';

describe.skip('BaseBreadcrumb.vue', () => {
  it('Default title page English version', () => {
    const wrapper = mount(BaseBreadcrumb, {
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.text()).toContain('Page');
  });
  it('Default title page Russian version', () => {
    const wrapper = mount(BaseBreadcrumb, {
      global: {
        plugins: plugins('ru'),
      },
    });

    expect(wrapper.text()).toContain('Страница');
  });

  it('Displaying the Title English version', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        title: 'sidebar.controllers',
      },
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.text()).toContain('Controllers');
  });

  it('Displaying the Title Russian version', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        title: 'sidebar.controllers',
      },
      global: {
        plugins: plugins('ru'),
      },
    });

    expect(wrapper.text()).toContain('Контроллеры');
  });

  it('Displaying breadcrumbs English version', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        title: 'sidebar.controllers',
        breadcrumbs: [
          {
            text: 'sidebar.controllers',
            disabled: true,
            href: '#',
          },
          {
            text: 'sidebar.controllerDetails',
            disabled: false,
            href: '#',
          },
        ],
      },
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.text()).toContain('Controllers');
    expect(wrapper.text()).toContain('Controller Details');
  });

  it('Displaying breadcrumbs Russian version', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        title: 'sidebar.controllers',
        breadcrumbs: [
          {
            text: 'sidebar.controllers',
            disabled: true,
            href: '#',
          },
          {
            text: 'sidebar.controllerDetails',
            disabled: false,
            href: '#',
          },
        ],
      },
      global: {
        plugins: plugins('ru'),
      },
    });

    expect(wrapper.text()).toContain('Контроллеры');
    expect(wrapper.text()).toContain('Детали Контроллера');
  });
});
