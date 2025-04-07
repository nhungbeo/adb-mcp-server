import { Request, Response } from "express";
import { listConnectedDevices, checkAdbAvailable } from "../utils/adb";
import { MCPRequest, MCPResponse, DeviceListParams } from "../types";

// Original Express handler (kept for backwards compatibility)
export const handleDeviceListRequestExpress = async (req: Request, res: Response) => {
  try {
    // First check if ADB is available
    const adbAvailable = await checkAdbAvailable();
    if (!adbAvailable) {
      return res.status(500).json({
        error: "ADB is not available on this system",
        message: "Make sure Android Debug Bridge (ADB) is installed and in your PATH",
      });
    }

    const devices = await listConnectedDevices();

    if (devices.length === 0) {
      return res.status(200).json({
        devices,
        message: "No devices connected. Connect a device or start an emulator.",
      });
    }

    res.status(200).json({
      devices,
      message: `Found ${devices.length} connected device(s)`,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Failed to list connected devices",
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: "Failed to list connected devices",
        message: "Unknown error occurred",
      });
    }
  }
};

// New MCP handler
export const handleDeviceListRequest = async (mcpRequest: MCPRequest): Promise<MCPResponse> => {
  try {
    // First check if ADB is available
    const adbAvailable = await checkAdbAvailable();
    if (!adbAvailable) {
      return {
        id: mcpRequest.id,
        error: {
          code: 500,
          message: "ADB is not available on this system",
          data: "Make sure Android Debug Bridge (ADB) is installed and in your PATH",
        },
      };
    }

    const devices = await listConnectedDevices();

    return {
      id: mcpRequest.id,
      result: {
        devices,
        message: devices.length === 0 ? "No devices connected. Connect a device or start an emulator." : `Found ${devices.length} connected device(s)`,
      },
    };
  } catch (error) {
    return {
      id: mcpRequest.id,
      error: {
        code: 500,
        message: "Failed to list connected devices",
        data: error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};
