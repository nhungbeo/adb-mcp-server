import { MCPRequest, MCPResponse, UiElementsParams } from "../types";
import { executeAdbCommand } from "../utils/adb";
import * as fs from "fs/promises";
import * as path from "path";

export const handleUiElementsRequest = async (mcpRequest: MCPRequest): Promise<MCPResponse> => {
  const params = mcpRequest.params as UiElementsParams;

  if (!params.deviceId) {
    return {
      id: mcpRequest.id,
      error: {
        code: 400,
        message: "Missing required parameter",
        data: "deviceId is required",
      },
    };
  }

  const deviceId = params.deviceId;
  const savePath = params.savePath || "screenshots/";
  const fileName = `ui_${Date.now()}.xml`;
  const localPath = path.join(savePath, fileName);
  const remotePath = "/sdcard/ui.xml";

  try {
    // Ensure the save directory exists
    await fs.mkdir(savePath, { recursive: true });

    // Dump UI hierarchy to XML file on the device
    await executeAdbCommand(`adb -s ${deviceId} shell uiautomator dump ${remotePath}`);

    // Pull the XML file from the device
    await executeAdbCommand(`adb -s ${deviceId} pull ${remotePath} ${localPath}`);

    // Read the XML file
    const xmlContent = await fs.readFile(localPath, "utf-8");

    return {
      id: mcpRequest.id,
      result: {
        message: "UI elements retrieved successfully",
        xml: xmlContent,
      },
    };
  } catch (error) {
    console.error("Error getting UI elements:", error);
    return {
      id: mcpRequest.id,
      error: {
        code: 500,
        message: "Failed to get UI elements",
        data: error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};
