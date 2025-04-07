# ADB MCP Server

This project is an MCP (Model Context Protocol) server that utilizes ADB (Android Debug Bridge) to connect with mobile devices. It provides functionality to list connected devices and capture screenshots from those devices.

## Features

- List connected Android devices using the `adb devices` command.
- Capture screenshots from connected devices and save them to a specified location.

## Project Structure

```
adb-mcp-server
├── src
│   ├── index.ts               # Entry point of the MCP server
│   ├── utils
│   │   ├── adb.ts             # ADB utility functions
│   │   └── screenshot.ts       # Screenshot capture utility
│   ├── handlers
│   │   ├── deviceList.ts      # Handler for device listing requests
│   │   └── screenshot.ts       # Handler for screenshot requests
│   ├── types
│   │   └── index.ts           # TypeScript interfaces and types
│   └── config.ts              # Configuration settings for the server
├── scripts
│   └── build.js               # Build script for TypeScript files
├── tests
│   ├── adb.test.ts            # Unit tests for ADB functions
│   └── screenshot.test.ts      # Unit tests for screenshot functions
├── .gitignore                  # Git ignore file
├── package.json                # NPM configuration file
├── tsconfig.json              # TypeScript configuration file
├── README.md                   # Project documentation
└── LICENSE                     # Licensing information
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
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

To start the MCP server, run the following command:
```
node dist/index.js
```

### Listing Connected Devices

To list connected devices, send a request to the appropriate endpoint (details to be defined in the API documentation).

### Capturing Screenshots

To capture a screenshot from a connected device, send a request to the screenshot endpoint with the necessary parameters (details to be defined in the API documentation).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.