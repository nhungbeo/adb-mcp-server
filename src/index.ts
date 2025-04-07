#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import { handleDeviceListRequest } from "./handlers/deviceList";
import { handleScreenshotRequest } from "./handlers/screenshot";
import { handleUiElementsRequest } from "./handlers/uiElements";

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
