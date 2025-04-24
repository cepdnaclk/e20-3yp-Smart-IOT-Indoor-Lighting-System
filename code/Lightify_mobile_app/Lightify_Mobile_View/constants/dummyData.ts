export interface Device {
    deviceId: number
    deviceName: string;
    macAddress: string;
  }

  
export const devices: Device[] = [
    {
        deviceId: 1,
        deviceName: 'Device 1',
        macAddress: '00:11:22:33:44:55',
    },
    {
        deviceId: 2,
        deviceName: 'Device 2',
        macAddress: '66:77:88:99:AA:BB',
    },
    {
        deviceId: 3,
        deviceName: 'Device 3',
        macAddress: 'CC:DD:EE:FF:00:11',
    },
    {
        deviceId: 4,
        deviceName: 'Device 4',
        macAddress: '22:33:44:55:66:77',
    }
]