export enum ObjectsCategory {
  Controller = 'controller',
  GenericInput = 'genericInput',
  Regulator = 'regulator',
  Sensor = 'sensor',
  Default = 'default',
}

export enum ControllerType {
  MegaD = 'mega_d',
}

export enum SensorType {
  BH1750 = 'bh1750',
  BME280 = 'bme280',
  BMP280 = 'bmp280',
  CS = 'cs',
  DS18B20 = 'ds18b20',
  HTU21D = 'htu21d',
}

export enum ConnectionType {
  HTTP = 'http',
  MQTT = 'mqtt',
}
