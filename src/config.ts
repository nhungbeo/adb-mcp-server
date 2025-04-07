import path from "path";

// Configuration settings for the MCP server
export const config = {
  port: 3000, // Port number for the server
  adbPath: "adb", // Path to the ADB executable
  screenshotsPath: path.join(__dirname, "..", "screenshots"), // Base path for screenshots
};
