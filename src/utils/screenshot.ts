import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { config } from "../config";

const execPromise = promisify(exec);

/**
 * Captures a screenshot from a connected device using ADB and saves it to the specified location.
 * @param {string} deviceId - The ID of the connected device.
 * @param {string} outputPath - The path where the screenshot will be saved.
 * @returns {Promise<string>} - A promise that resolves to the output path of the saved screenshot.
 */
export const captureScreenshot = async (deviceId: string, outputPath: string): Promise<string> => {
  // Resolve full path using config.screenshotsPath as base
  const fullPath = path.join(config.screenshotsPath, outputPath);
  // Ensure the directory exists
  const outputDir = path.dirname(fullPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const tempPath = "/sdcard/screenshot.png";

  try {
    // Capture screenshot on device
    await execPromise(`adb -s ${deviceId} shell screencap -p ${tempPath}`);

    // Pull the screenshot to the computer
    await execPromise(`adb -s ${deviceId} pull ${tempPath} ${fullPath}`);

    // Clean up the temporary file on the device
    await execPromise(`adb -s ${deviceId} shell rm ${tempPath}`);

    return fullPath;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    throw new Error(`Failed to capture screenshot from device ${deviceId}`);
  }
};
