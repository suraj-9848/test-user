'use client'

import { Shield, AlertTriangle, Eye, Monitor } from 'lucide-react';

interface SecurityMonitorProps {
  violations: number;
  tabSwitches: number;
  isFullscreen: boolean;
  cameraStatus: 'enabled' | 'disabled' | 'error';
}

export default function SecurityMonitor({
  violations,
  tabSwitches,
  isFullscreen,
  cameraStatus
}: SecurityMonitorProps) {
  const getSecurityStatusColor = () => {
    if (violations === 0) return 'text-green-600';
    if (violations <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityStatusText = () => {
    if (violations === 0) return 'Secure';
    if (violations <= 2) return 'Warning';
    return 'Critical';
  };

  const getCameraStatusColor = () => {
    switch (cameraStatus) {
      case 'enabled': return 'text-green-600';
      case 'disabled': return 'text-gray-400';
      case 'error': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border p-3 z-40 min-w-[200px]">
      <div className="space-y-2 text-sm">
        {/* Security Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className={`h-4 w-4 mr-2 ${getSecurityStatusColor()}`} />
            <span className="font-medium">Security:</span>
          </div>
          <span className={`font-medium ${getSecurityStatusColor()}`}>
            {getSecurityStatusText()}
          </span>
        </div>

        {/* Violations Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
            <span>Violations:</span>
          </div>
          <span className={`font-medium ${violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {violations}
          </span>
        </div>

        {/* Tab Switches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Monitor className="h-4 w-4 mr-2 text-blue-500" />
            <span>Tab Switches:</span>
          </div>
          <span className={`font-medium ${tabSwitches > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
            {tabSwitches}
          </span>
        </div>

        {/* Fullscreen Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Monitor className="h-4 w-4 mr-2 text-purple-500" />
            <span>Fullscreen:</span>
          </div>
          <span className={`font-medium ${isFullscreen ? 'text-green-600' : 'text-red-600'}`}>
            {isFullscreen ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Camera Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className={`h-4 w-4 mr-2 ${getCameraStatusColor()}`} />
            <span>Camera:</span>
          </div>
          <span className={`font-medium ${getCameraStatusColor()}`}>
            {cameraStatus === 'enabled' && 'Recording'}
            {cameraStatus === 'disabled' && 'Disabled'}
            {cameraStatus === 'error' && 'Error'}
          </span>
        </div>

        {/* Warning Message */}
        {violations > 0 && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <div className="flex items-start">
              <AlertTriangle className="h-3 w-3 text-yellow-600 mr-1 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-800">
                {violations === 1 && 'Security violation detected. Please follow test guidelines.'}
                {violations === 2 && 'Multiple violations detected. Test may auto-submit if violations continue.'}
                {violations >= 3 && 'Critical violations detected. Test will be auto-submitted.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}