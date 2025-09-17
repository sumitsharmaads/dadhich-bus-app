"use client";

import React, { useState, useEffect } from "react";
import { authService } from "@/lib/api/services/auth.service";
import { Session } from "@/lib/api/types/auth.types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface SessionManagementProps {
  onLogout?: () => void;
}

const SessionManagement: React.FC<SessionManagementProps> = ({ onLogout }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await authService.getSessions();
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogoutAll = async () => {
    if (
      window.confirm(
        "Are you sure you want to logout from all devices? This will end all your active sessions."
      )
    ) {
      try {
        await authService.logoutAllDevices();
        if (onLogout) {
          onLogout();
        }
      } catch (error) {
        console.error("Logout all failed:", error);
      }
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (window.confirm("Are you sure you want to terminate this session?")) {
      try {
        setTerminating(sessionId);
        await authService.terminateSession(sessionId);
        await fetchSessions(); // Refresh the list
      } catch (error) {
        console.error("Failed to terminate session:", error);
      } finally {
        setTerminating(null);
      }
    }
  };

  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.includes("iPhone") || deviceName.includes("Android")) {
      return "📱";
    } else if (deviceName.includes("Tablet")) {
      return "📱";
    } else if (
      deviceName.includes("Windows") ||
      deviceName.includes("Mac") ||
      deviceName.includes("Linux")
    ) {
      return "💻";
    }
    return "🖥️";
  };

  const getLocationFromIP = (ip: string) => {
    // This is a simple implementation. In a real app, you might want to use a geolocation service
    if (ip === "127.0.0.1" || ip === "::1") {
      return "Local";
    }
    return ip;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Active Sessions
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Manage your active sessions across devices
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Logout Current
          </button>
          <button
            onClick={handleLogoutAll}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout All Devices
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {sessions.map((session) => (
            <li key={session.id} className="px-4 md:px-6 py-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="text-xl md:text-2xl flex-shrink-0">
                    {getDeviceIcon(session.deviceName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.deviceName}
                      </p>
                      {session.isCurrent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                      <span>{getLocationFromIP(session.ip)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        Last seen {dayjs(session.lastSeenAt).fromNow()}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>Created {dayjs(session.createdAt).fromNow()}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-400 truncate">
                      {session.userAgent}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end lg:justify-start">
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleTerminateSession(session.id)}
                      disabled={terminating === session.id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {terminating === session.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                          Terminating...
                        </>
                      ) : (
                        "Terminate"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 md:p-4">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-shrink-0 mb-2 sm:mb-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="sm:ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Session Security
            </h3>
            <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-700">
              <p>
                Your sessions are automatically cleaned up after 30 days of
                inactivity. If you notice any suspicious activity, terminate the
                session immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
