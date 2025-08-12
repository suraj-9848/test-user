import React from "react";

export interface ProContextType {
  isProUser: boolean;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export declare const ProProvider: React.FC<{ children: React.ReactNode }>;
export declare function usePro(): ProContextType;

declare const _default: React.FC<{ children: React.ReactNode }>;
export default _default;
