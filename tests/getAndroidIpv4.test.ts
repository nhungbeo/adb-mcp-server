import { handleGetAndroidIpv4Request } from "../src/handlers/getAndroidIpv4";
import { executeAdbCommand } from "../src/utils/adb";
import { MCPRequest } from "../src/types";

jest.mock("../src/utils/adb");

describe("getAndroidIpv4", () => {
  const mockRequest: MCPRequest = {
    id: "test-id",
    method: "get_ipv4_android",
    params: {
      deviceId: "test-device",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return IPv4 address for valid device", async () => {
    const mockOutput = `
      37: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 
          link/ether ae:f3:2b:70:49:84 
          inet 192.168.33.27/24 scope global wlan0
          inet6 fe80::acf3:2bff:fe70:4984/64 scope link
    `;
    
    (executeAdbCommand as jest.Mock).mockResolvedValue(mockOutput);

    const response = await handleGetAndroidIpv4Request(mockRequest);

    expect(executeAdbCommand).toHaveBeenCalledWith(
      "adb -s test-device shell ip addr show wlan0"
    );
    expect(response.result?.ipv4).toBe("192.168.33.27");
  });

  test("should handle missing deviceId", async () => {
    const invalidRequest: MCPRequest = {
      id: "test-id",
      method: "get_ipv4_android",
      params: {},
    };

    const response = await handleGetAndroidIpv4Request(invalidRequest);

    expect(response.error?.code).toBe(400);
    expect(response.error?.message).toBe("Missing required parameter");
  });

  test("should handle device without IPv4", async () => {
    const mockOutput = `
      37: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 
          link/ether ae:f3:2b:70:49:84 
          inet6 fe80::acf3:2bff:fe70:4984/64 scope link
    `;
    
    (executeAdbCommand as jest.Mock).mockResolvedValue(mockOutput);

    const response = await handleGetAndroidIpv4Request(mockRequest);

    expect(response.error?.code).toBe(500);
    expect(response.error?.message).toBe("Failed to get device IPv4");
  });

  test("should handle adb command failure", async () => {
    (executeAdbCommand as jest.Mock).mockRejectedValue(new Error("ADB command failed"));

    const response = await handleGetAndroidIpv4Request(mockRequest);

    expect(response.error?.code).toBe(500);
    expect(response.error?.message).toBe("Failed to get device IPv4");
  });
});
