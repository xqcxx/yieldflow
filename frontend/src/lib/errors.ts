export interface NetworkError {
  code: string;
  message: string;
  chainId?: number;
}

export class NetworkError extends Error {
  code: string;
  chainId?: number;

  constructor(message: string, code: string, chainId?: number) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
    this.chainId = chainId;
  }
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function handleNetworkError(error: unknown): string {
  if (isNetworkError(error)) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Network connection error. Please check your internet connection.';
      case 'CHAIN_NOT_FOUND':
        return `Chain ${error.chainId} is not supported.`;
      case 'SWITCH_CHAIN_FAILED':
        return 'Failed to switch network. Please switch manually.';
      default:
        return error.message;
    }
  }
  return 'An unexpected error occurred.';
}
