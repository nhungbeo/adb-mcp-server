# ADB MCP Server

A Model Context Protocol (MCP) server for managing Android Debug Bridge (ADB) connections and interacting with Android devices.

## Features

- **Device Management**: List all connected Android devices
- **Screenshot Capture**: Take screenshots from connected devices
- **UI Element Inspection**: Extract UI hierarchy from device screens
- **ADB Command Execution**: Run arbitrary ADB commands on connected devices

## Prerequisites

- Android Debug Bridge (ADB) must be installed on your system and added to your PATH
- Node.js (v14 or higher)
- TypeScript

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/adb-mcp-server.git
   cd adb-mcp-server
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

## Usage

### Starting the Server

The ADB MCP server runs as a Model Context Protocol server over stdio:

```
npm start
```

For development with auto-restart on file changes:

```
npm run dev
```

### Available Tools

The server exposes the following MCP tools:

#### 1. List Connected Devices

```
get_devices
```

Returns a list of all connected Android devices with their IDs and connection states.

#### 2. Capture Screenshot

```
capture_screenshot
```

Parameters:
- `deviceId`: ID of the device to capture from
- `path`: Path where the screenshot will be saved

The screenshot will be named according to the format: YYYYMMDD_HH_MM_SS.png

#### 3. Get UI Elements

```
get_ui_elements
```

Parameters:
- `deviceId`: ID of the device to extract UI hierarchy from

Returns the full UI hierarchy in XML format, useful for UI automation and testing.

#### 4. Execute ADB Command

```
execute_adb_command
```

Parameters:
- `deviceId`: ID of the device to run the command on
- `command`: The ADB command to execute

Allows execution of arbitrary ADB commands on the specified device.

## Project Structure

```
adb-mcp-server
├── src
│   ├── index.ts               # Main MCP server entry point
│   ├── handlers/              # Request handlers for each feature
│   │   ├── deviceList.ts      # Device listing functionality
│   │   ├── screenshot.ts      # Screenshot capture functionality
│   │   └── uiElements.ts      # UI hierarchy extraction
│   ├── utils/                 # Utility functions
│   │   ├── adb.ts             # ADB command execution utilities
│   │   └── screenshot.ts      # Screenshot handling utilities
│   └── types/                 # TypeScript type definitions
├── package.json               # Project dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.