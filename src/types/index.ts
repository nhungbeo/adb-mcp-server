export interface Device {
  id: string;
  name: string;
  state: string;
}

export interface ScreenshotRequest {
  deviceId: string;
  savePath: string;
}

// MCP Protocol types
export interface MCPRequest {
  id: string;
  method: string;
  params: any;
}

export interface MCPResponse {
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface DeviceListParams {
  // Empty for now, but could include filters in the future
}

export interface ScreenshotParams {
  deviceId: string;
  savePath: string;
}

export interface UiElementsParams {
  deviceId: string;
  savePath?: string;
}

export interface ExecuteAdbCommandParams {
  deviceId: string;
  command: string;
}
