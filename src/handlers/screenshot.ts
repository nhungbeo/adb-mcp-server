import { Request, Response } from "express";
import { captureScreenshot } from "../utils/screenshot";
import { ScreenshotRequest, MCPRequest, MCPResponse, ScreenshotParams } from "../types";

// Original Express handler (kept for backwards compatibility)
export const handleScreenshotRequestExpress = async (req: Request, res: Response) => {
  const screenshotRequest: ScreenshotRequest = req.body;

  try {
    const filePath = await captureScreenshot(screenshotRequest.deviceId, screenshotRequest.savePath);
    res.status(200).json({ message: "Screenshot captured successfully", filePath });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to capture screenshot", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to capture screenshot", error: "Unknown error occurred" });
    }
  }
};

// New MCP handler
export const handleScreenshotRequest = async (mcpRequest: MCPRequest): Promise<MCPResponse> => {
  const params = mcpRequest.params as ScreenshotParams;

  if (!params.deviceId || !params.savePath) {
    return {
      id: mcpRequest.id,
      error: {
        code: 400,
        message: "Missing required parameters",
        data: "Both deviceId and savePath are required",
      },
    };
  }

  try {
    const filePath = await captureScreenshot(params.deviceId, params.savePath);

    return {
      id: mcpRequest.id,
      result: {
        message: "Screenshot captured successfully",
        filePath,
      },
    };
  } catch (error) {
    return {
      id: mcpRequest.id,
      error: {
        code: 500,
        message: "Failed to capture screenshot",
        data: error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};
