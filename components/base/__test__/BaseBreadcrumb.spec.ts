import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BaseBreadcrumb from '../../shared/UIBreadcrumb.vue';
import { plugins } from '@/test/unit.setup';

describe('BaseBreadcrumb.vue', () => {
  it('Default title page English version', async () => {
    const wrapper = await mountSuspended(BaseBreadcrumb, {
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.text()).toContain('Page');
  });
  it('Default title page Russian version', async () => {
    const wrapper = await mountSuspended(BaseBreadcrumb, {
      global: {
        plugins: plugins('ru'),
      },
    });

    expect(wrapper.text()).toContain('Страница');
  });

  it('Displaying the Title English version', async () => {
    const wrapper = await mountSuspended(BaseBreadcrumb, {
      props: {
        title: 'pages.controllers',
      },
      global: {
        plugins: plugins(),
      },
    });

    expect(wrapper.text()).toContain('Controllers');
  });

  it('Displaying the Title Russian version', async () => {
    const wrapper = await mountSuspended(BaseBreadcrumb, {
      props: {
        title: 'pages.controllers',
      },
      global: {
        plugins: plugins('ru'),
      },
    });

    expect(wrapper.text()).toContain('Контроллеры');
  });

  it('Displaying breadcrumbs English version', async () => {
    const wrapper = await mountSuspended(BaseBreadcrumb, {
      props: {
        title: 'pages.controllers',
        breadcrumbs: [
          {
            text: 'pages.controllers',
            disabled: true,
            href: '#',
          },
          {
            text: 'pages.controllerDetails',
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

  it('Displaying breadcrumbs Russian version', async () => {
    const wrapper = await mountSuspended(BaseBreadcrumb, {
      props: {
        title: 'pages.controllers',
        breadcrumbs: [
          {
            text: 'pages.controllers',
            disabled: true,
            href: '#',
          },
          {
            text: 'pages.controllerDetails',
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
