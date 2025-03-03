export enum ObjectsCategory {
  Controller = 'controller',
  GenericInput = 'generic_input',
  Relay = 'relay',
  Regulator = 'regulator',
  Sensor = 'sensor',
  Conditioner = 'conditioner',
  RS485 = 'rs485',
}

export enum DevicePropertyKey {
  Temperature = 'temperature',
  Humidity = 'humidity',
  Illumination = 'illumination',
  Pressure = 'pressure',
  CO2 = 'co2',
  Motion = 'motion',
  Presence = 'presence',
  Current = 'current',
}

export enum Default {
  Default = 'default',
}

export enum Controller {
  MegaD = 'mega_d',
  WBMRM2mini = 'wb_mrm2_mini',
}

export enum Sensor {
  BH1750 = 'bh1750',
  BME280 = 'bme280',
  BMP280 = 'bmp280',
  DS18B20 = 'ds18b20',
  HTU21D = 'htu21d',
  HTU31D = 'htu31d',
  OUTDOOR = 'outdoor',
  SCD4X = 'scd4x',
  MOTION = 'motion',
  PRESENCE = 'presence',
  CS = 'cs',
}

export enum GenericInput {
  GenericInput = 'generic_input',
}

export enum Relay {
  Relay = 'relay',
}

export enum Regulator {
  Regulator = 'regulator',
}

export enum Conditioner {
  OnokomAUX1MBB = 'onokom/aux_1_mb_b',
  OnokomDK1MBB = 'onokom/dk_1_mb_b',
  OnokomGR1MBB = 'onokom/gr_1_mb_b',
  OnokomGR3MBB = 'onokom/gr_3_mb_b',
  OnokomHR1MBB = 'onokom/hr_1_mb_b',
  OnokomHS3MBB = 'onokom/hs_3_mb_b',
  OnokomHS6MBB = 'onokom/hs_6_mb_b',
  OnokomME1MBB = 'onokom/me_1_mb_b',
  OnokomMH8MBB = 'onokom/mh_8_mb_b',
  OnokomTCL1MBB = 'onokom/tcl_1_mb_b',
}

export enum RS485 {
  Bus = 'bus',
}

export enum Connection {
  HTTP = 'http',
  MQTT = 'mqtt',
}

export enum DeviceInterface {
  '1W' = '1W',
  '1WBUS' = '1WBUS',
  'ADC' = 'ADC',
  'DISCRETE' = 'Дискретный',
  'I2C' = 'I2C',
  'MODBUS' = 'MODBUS',
  'MEGAOUT' = 'MEGA-OUT',
  'MEGAIN' = 'MEGA-IN',
}

export enum RegulatorType {
  Complex = 'complex',
  PID = 'pid',
  Simple= 'simple'
}
