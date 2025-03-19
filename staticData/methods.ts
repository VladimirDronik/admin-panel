export type SwitchMethodMap = Record<string, { on: string; off: string }>;
export type ValueMethodMap = Record<string, string>;

export const switchPropMethodMap: SwitchMethodMap = {
  power_status: {
    on: 'switch_on',
    off: 'switch_off',
  },
  display_backlight: {
    on: 'switch_on_display_backlight',
    off: 'switch_off_display_backlight',
  },
  display_high_brightness: {
    on: 'switch_on_display_high_brightness',
    off: 'switch_off_display_high_brightness',
  },
  disable_display_on_power_off: {
    on: 'enable_display_on_power_off',
    off: 'disable_display_on_power_off',
  },
  silent_mode: {
    on: 'switch_on_silent_mode',
    off: 'switch_off_silent_mode',
  },
  eco_mode: {
    on: 'switch_on_eco_mode',
    off: 'switch_off_eco_mode',
  },
  turbo_mode: {
    on: 'switch_on_turbo_mode',
    off: 'switch_off_turbo_mode',
  },
  sleep_mode: {
    on: 'switch_on_sleep_mode',
    off: 'switch_off_sleep_mode',
  },
  ionization: {
    on: 'switch_on_ionization',
    off: 'switch_off_ionization',
  },
  self_cleaning: {
    on: 'switch_on_self_cleaning',
    off: 'switch_off_self_cleaning',
  },
  anti_fungus: {
    on: 'switch_on_anti_fungus',
    off: 'switch_off_anti_fungus',
  },
  sounds: {
    on: 'enable_sounds',
    off: 'disable_sounds',
  },
  on_duty_heating: {
    on: 'switch_on_on_duty_heating',
    off: 'switch_off_on_duty_heating',
  },
  soft_flow: {
    on: 'switch_on_soft_flow',
    off: 'switch_off_soft_flow',
  },
};

export const valuePropMethodMap: ValueMethodMap = {
  operating_mode: 'set_operating_mode',
  target_temperature: 'set_target_temperature',
  fan_speed: 'set_fan_speed',
  horizontal_slats_mode: 'set_horizontal_slats_mode',
  vertical_slats_mode: 'set_vertical_slats_mode',
};
