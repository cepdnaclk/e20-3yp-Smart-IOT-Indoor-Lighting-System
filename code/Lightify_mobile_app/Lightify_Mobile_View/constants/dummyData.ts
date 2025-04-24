export interface Device {
    deviceName: string;
    macAddress: string;
  }

  
export const devices: Device[] = [
    {
        deviceName: 'Device 1',
        macAddress: '00:11:22:33:44:55',
    },
    {
        deviceName: 'Device 2',
        macAddress: '66:77:88:99:AA:BB',
    },
    {
        deviceName: 'Device 3',
        macAddress: 'CC:DD:EE:FF:00:11',
    },
    {
        deviceName: 'Device 4',
        macAddress: '22:33:44:55:66:77',
    }
]