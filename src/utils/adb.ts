import { exec } from "child_process";
import { promisify } from "util";
import { Device } from "../types";

const execPromise = promisify(exec);

/**
 * Checks if ADB is available on the system
 * @returns {Promise<boolean>} - True if ADB is available, false otherwise
 */
export async function checkAdbAvailable(): Promise<boolean> {
  try {
    await execPromise("adb version");
    return true;
  } catch (error) {
    console.error("ADB is not available:", error);
    return false;
  }
}

/**
 * Executes an ADB command
 * @param {string} command - The ADB command to execute
 * @returns {Promise<string>} - The result of the command
 */
export async function executeAdbCommand(command: string): Promise<void> {
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.error(`ADB command ${command} stderr: ${stderr}`);
    }
    console.log(`ADB command ${command} stdout: ${stdout}`);
  } catch (error) {
    console.error(`Error executing ADB command ${command}:`, error);
    throw new Error(`Failed to execute ADB command: ${command}. Make sure ADB is installed and in your PATH.`);
  }
}

/**
 * Lists all connected Android devices
 * @returns {Promise<Device[]>} - Array of connected devices with their details
 */
export async function listConnectedDevices(): Promise<Device[]> {
  try {
    const { stdout } = await execPromise("adb devices -l");
    const lines = stdout.trim().split("\n").slice(1); // Skip the first line (header)

    const devices: Device[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const id = parts[0];
        const state = parts[1];

        // Skip devices not in device state (offline, unauthorized, etc)
        if (state !== "device") {
          devices.push({
            id,
            state,
            name: "Unknown",
          });
          continue;
        }

        // Extract device name/model
        let name = "Unknown";
        try {
          const { stdout: modelOutput } = await execPromise(`adb -s ${id} shell getprop ro.product.model`);
          name = modelOutput.trim();
        } catch (e) {
          console.warn(`Could not get model name for device ${id}`);
        }

        devices.push({
          id,
          name,
          state,
        });
      }
    }

    return devices;
  } catch (error) {
    console.error("Error listing connected devices:", error);
    throw new Error("Failed to list connected devices. Make sure ADB is installed and in your PATH.");
  }
}
