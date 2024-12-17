export enum ObjectsCategory {
  Controller = 'controller',
  GenericInput = 'generic_input',
  GenericOutput = 'generic_output',
  Regulator = 'regulator',
  Sensor = 'sensor',
}

export enum DevicePropertyKey {
  Temperature = 'temperature',
  Humidity = 'humidity',
  Illumination = 'illumination',
  Pressure = 'pressure',
  CO2 = 'co2',
}

export enum Default {
  Default = 'default',
}

export enum Controller {
  MegaD = 'mega_d',
}

export enum Sensor {
  BH1750 = 'bh1750',
  BME280 = 'bme280',
  BMP280 = 'bmp280',
  DS18B20 = 'ds18b20',
  HTU21D = 'htu21d',
  OUTDOOR = 'outdoor',
  SCD4X = 'scd4x',
}

export enum GenericInput {
  GenericInput = 'generic_input',
}

export enum GenericOutput {
  Relay = 'relay',
}


export enum Connection {
  HTTP = 'http',
  MQTT = 'mqtt',
}

export enum DeviceInterface {
  '1W' = '1W',
  '1WBUS' = '1WBUS',
  'ADC' = 'АЦП',
  'DISCRETE' = 'Дискретный',
  'I2C' = 'I2C',
  'MODBUS' = 'MODBUS'
}


