import { captureScreenshot } from '../utils/screenshot';

describe('Screenshot Functionality', () => {
    it('should capture a screenshot from a connected device', async () => {
        const deviceId = 'emulator-5554'; // Example device ID
        const outputPath = 'screenshots/screenshot.png'; // Example output path

        const result = await captureScreenshot(deviceId, outputPath);

        expect(result).toBeTruthy();
        expect(result).toContain('Screenshot saved to'); // Adjust based on actual output
    });

    it('should throw an error if no device is connected', async () => {
        const deviceId = 'invalid-device-id'; // Invalid device ID
        const outputPath = 'screenshots/screenshot.png';

        await expect(captureScreenshot(deviceId, outputPath)).rejects.toThrow('No device connected');
    });
});