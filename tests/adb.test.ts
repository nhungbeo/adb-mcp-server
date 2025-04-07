import { listConnectedDevices } from '../src/utils/adb';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

describe('ADB Utility Functions', () => {
    describe('listConnectedDevices', () => {
        it('should return a list of connected devices', async () => {
            const devices = await listConnectedDevices();
            expect(Array.isArray(devices)).toBe(true);
        });

        it('should handle no connected devices', async () => {
            jest.spyOn(global, 'exec').mockImplementation((cmd, callback) => {
                callback(null, 'List of devices attached\n');
            });

            const devices = await listConnectedDevices();
            expect(devices).toEqual([]);
        });

        it('should handle ADB command errors', async () => {
            jest.spyOn(global, 'exec').mockImplementation((cmd, callback) => {
                callback(new Error('ADB command failed'), null);
            });

            await expect(listConnectedDevices()).rejects.toThrow('ADB command failed');
        });
    });
});