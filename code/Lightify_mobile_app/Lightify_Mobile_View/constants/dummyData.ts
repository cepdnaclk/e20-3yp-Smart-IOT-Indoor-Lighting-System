export interface Device {
    deviceID: number;
    deviceName: string;
    macAddress: string;
  }

  
export const devices: Device[] = [
    {
        deviceID:1,
        deviceName: 'Device 1',
        macAddress: '00:11:22:33:44:55',
    },
    {
        deviceID:2,
        deviceName: 'Device 2',
        macAddress: '66:77:88:99:AA:BB',
    },
    {
        deviceID:3,
        deviceName: 'Device 3',
        macAddress: 'CC:DD:EE:FF:00:11',
    },
    {
        deviceID:4,
        deviceName: 'Device 4',
        macAddress: '22:33:44:55:66:77',
    }
]