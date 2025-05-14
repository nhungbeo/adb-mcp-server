#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import { handleDeviceListRequest } from "./handlers/deviceList";
import { handleScreenshotRequest } from "./handlers/screenshot";
import { handleUiElementsRequest } from "./handlers/uiElements";
import { handleGetAndroidIpv4Request } from "./handlers/getAndroidIpv4";
import { executeAdbCommand } from "./utils/adb";

class AdbMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "adb-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_devices",
          description: "Kiểm tra danh sách thiết bị đã được kết nối. List all connected Android devices",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
        {
          name: "capture_screenshot",
          description: "Capture screenshot from connected Android device. Tên đặt theo định dạng: ngaythangnam_gio_phut_giay.png",
          inputSchema: {
            type: "object",
            properties: {
              deviceId: {
                type: "string",
                description: "Device ID to capture screenshot from",
              },
              path: {
                type: "string",
                description: "Path to save the screenshot",
              },
            },
            required: ["deviceId", "path"],
          },
        },
        {
          name: "execute_adb_command",
          description: "Execute an ADB command on a connected Android device",
          inputSchema: {
            type: "object",
            properties: {
              deviceId: {
                type: "string",
                description: "Device ID to execute the command on",
              },
              command: {
                type: "string",
                description: "The ADB command to execute",
              },
            },
            required: ["deviceId", "command"],
          },
        },
        {
          name: "get_ui_elements",
          description: "Get all UI elements from connected Android device",
          inputSchema: {
            type: "object",
            properties: {
              deviceId: {
                type: "string",
                description: "Device ID to get UI elements from",
              },
            },
            required: ["deviceId"],
          },
        },
        {
          name: "get_ipv4_android",
          description: "Get IPv4 address of connected Android device via WiFi interface",
          inputSchema: {
            type: "object",
            properties: {
              deviceId: {
                type: "string",
                description: "Device ID to get IPv4 from",
              },
            },
            required: ["deviceId"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case "get_devices": {
            const response = await handleDeviceListRequest({
              id: randomUUID(),
              method: "get_devices",
              params: {},
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.result?.devices, null, 2),
                },
              ],
            };
          }
          case "capture_screenshot": {
            if (!request.params.arguments?.deviceId || !request.params.arguments?.path) {
              throw new McpError(ErrorCode.InvalidParams, "Missing required parameters: deviceId and path");
            }

            const response = await handleScreenshotRequest({
              id: randomUUID(),
              method: "capture_screenshot",
              params: {
                deviceId: request.params.arguments.deviceId,
                savePath: request.params.arguments.path,
              },
            });

            return {
              content: [
                {
                  type: "text",
                  text: `Screenshot captured and saved to ${response.result?.filePath}`,
                },
              ],
            };
          }
          case "get_ui_elements": {
            if (!request.params.arguments?.deviceId) {
              throw new McpError(ErrorCode.InvalidParams, "Missing required parameter: deviceId");
            }

            const response = await handleUiElementsRequest({
              id: randomUUID(),
              method: "get_ui_elements",
              params: {
                deviceId: request.params.arguments.deviceId,
              },
            });

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(response.result?.xml, null, 2),
                },
              ],
            };
          }
          case "execute_adb_command": {
            if (!request.params.arguments?.deviceId || !request.params.arguments?.command) {
              throw new McpError(ErrorCode.InvalidParams, "Missing required parameters: deviceId and command");
            }

            const deviceId = request.params.arguments.deviceId;
            const command = request.params.arguments.command;

            const result = await executeAdbCommand(`adb -s ${deviceId} ${command}`);

            return {
              content: [
                {
                  type: "text",
                  text: result,
                },
              ],
            };
          }
          case "get_ipv4_android": {
            if (!request.params.arguments?.deviceId) {
              throw new McpError(ErrorCode.InvalidParams, "Missing required parameter: deviceId");
            }

            const response = await handleGetAndroidIpv4Request({
              id: randomUUID(),
              method: "get_ipv4_android",
              params: {
                deviceId: request.params.arguments.deviceId,
              },
            });

            if (response.error) {
              throw new McpError(response.error.code, response.error.message, response.error.data);
            }

            return {
              content: [
                {
                  type: "text",
                  text: response.result?.ipv4 || "",
                },
              ],
            };
          }
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(ErrorCode.InternalError, error instanceof Error ? error.message : "Unknown error occurred");
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("ADB MCP server running on stdio");
  }
}

const server = new AdbMcpServer();
server.run().catch(console.error);
