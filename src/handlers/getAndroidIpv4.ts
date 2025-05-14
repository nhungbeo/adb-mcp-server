import { MCPRequest, MCPResponse, GetAndroidIpv4Params } from "../types";
import { executeAdbCommand } from "../utils/adb";

export const handleGetAndroidIpv4Request = async (mcpRequest: MCPRequest): Promise<MCPResponse> => {
  const params = mcpRequest.params as GetAndroidIpv4Params;

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

  try {
    // Thực thi lệnh lấy thông tin network interface
    const output = await executeAdbCommand(`adb -s ${params.deviceId} shell ip addr show wlan0`);
    
    // Parse IPv4 từ output
    const ipv4 = parseIpv4FromOutput(output);
    if (!ipv4) {
      throw new Error("No IPv4 address found");
    }

    return {
      id: mcpRequest.id,
      result: {
        ipv4: ipv4,
      },
    };
  } catch (error) {
    console.error("Error getting device IPv4:", error);
    return {
      id: mcpRequest.id,
      error: {
        code: 500,
        message: "Failed to get device IPv4",
        data: error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};

function parseIpv4FromOutput(output: string): string {
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('inet ')) {
      const match = line.match(/inet\s+(\d+\.\d+\.\d+\.\d+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
  }
  throw new Error("Failed to parse IPv4 address from output");
}
