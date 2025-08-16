// app/manager/page.tsx
// Manager dashboard for healthcare shift tracking - Following naming conventions
"use client";

import { useState, useEffect } from "react";
// @ts-ignore
import { useUser } from "@auth0/nextjs-auth0";
import {
  getActiveStaffAction,
  getAllStaffHistoryAction,
  getAnalyticsAction,
  updateOrganizationSettingsAction,
} from "../actions/shift-actions";

interface ActiveStaffMember {
  id: string;
  clock_in_time: string | Date;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  organization: {
    id: string;
    name: string;
  };
}

interface StaffHistoryEntry {
  id: string;
  clock_in_time: string | Date;
  clock_out_time: string | Date;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  organization: {
    id: string;
    name: string;
  };
}

interface AnalyticsData {
  activeToday: number;
  avgHoursPerDay: number;
  totalShiftsLastWeek: number;
  dailyClockIns: Array<{ date: string; count: number }>;
  shiftsLastWeek: StaffHistoryEntry[];
}

export default function ManagerDashboard() {
  const { user, isLoading: userLoading } = useUser();

  // State management
  const [activeStaff, setActiveStaff] = useState<ActiveStaffMember[]>([]);
  const [staffHistory, setStaffHistory] = useState<StaffHistoryEntry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "active" | "history" | "settings"
  >("overview");

  // Load data when component mounts
  useEffect(() => {
    if (user && !userLoading) {
      loadAllData();
    }
  }, [user, userLoading]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [activeResult, historyResult, analyticsResult] = await Promise.all([
        getActiveStaffAction(),
        getAllStaffHistoryAction(),
        getAnalyticsAction(),
      ]);

      if (activeResult.success) {
        const mappedActive: ActiveStaffMember[] = (
          activeResult.activeStaff || []
        ).map((s: any) => ({
          id: s.id,
          clock_in_time: s.clock_in_time,
          user: {
            id: s.user?.id,
            email: s.user?.email,
            name: s.user?.name ?? null,
          },
          organization: {
            id: s.organization?.id,
            name: s.organization?.name,
          },
        }));
        setActiveStaff(mappedActive);
      }

      if (historyResult.success) {
        const mappedHistory: StaffHistoryEntry[] = (
          historyResult.staffHistory || []
        ).map((s: any) => ({
          id: s.id,
          clock_in_time: s.clock_in_time,
          clock_out_time: s.clock_out_time,
          user: {
            id: s.user?.id,
            email: s.user?.email,
            name: s.user?.name ?? null,
          },
          organization: {
            id: s.organization?.id,
            name: s.organization?.name,
          },
        }));
        setStaffHistory(mappedHistory);
      }

      if (analyticsResult.success) {
        const a = analyticsResult.analytics || null;
        if (a) {
          const mappedShifts: StaffHistoryEntry[] = (
            a.shiftsLastWeek || []
          ).map((s: any) => ({
            id: s.id,
            clock_in_time: s.clock_in_time,
            clock_out_time: s.clock_out_time,
            user: {
              id: s.user?.id,
              email: s.user?.email,
              name: s.user?.name ?? null,
            },
            organization: {
              id: s.organization?.id,
              name: s.organization?.name,
            },
          }));

          const mappedAnalytics: AnalyticsData = {
            activeToday: a.activeToday,
            avgHoursPerDay: a.avgHoursPerDay,
            totalShiftsLastWeek: a.totalShiftsLastWeek,
            dailyClockIns: a.dailyClockIns,
            shiftsLastWeek: mappedShifts,
          };

          setAnalytics(mappedAnalytics);
        } else {
          setAnalytics(null);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateShiftDuration = (
    clockIn: string | Date,
    clockOut: string | Date
  ): number => {
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const durationMs = end.getTime() - start.getTime();
    return Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const formatUserName = (user: { name?: string | null; email: string }) => {
    if (user.name) return user.name;
    return user.email;
  };

  // Loading state
  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Manager Dashboard...</p>
        </div>
      </div>
    );
  }

  // Authentication required
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl text-gray-800 font-bold mb-4">
            🔒 Manager Access Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in as a manager to access this dashboard.
          </p>
          <a
            href="/auth/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                👨‍💼 Manager Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome,{" "}
                {formatUserName({
                  name: user?.name,
                  email: user?.email,
                })}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={loadAllData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Refresh Data
              </button>
              <a
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                👤 Care Worker View
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { key: "overview", label: "📊 Overview", count: null },
              {
                key: "active",
                label: "🟢 Active Staff",
                count: activeStaff.length,
              },
              {
                key: "history",
                label: "📚 Shift History",
                count: staffHistory.length,
              },
              { key: "settings", label: "⚙️ Settings", count: null },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && analytics && (
          <div className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">👥</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Active Today
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {analytics.activeToday}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">⏱️</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Avg Hours/Day
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {analytics.avgHoursPerDay}h
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📅</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Shifts This Week
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {analytics.totalShiftsLastWeek}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📈</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Daily Avg
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">
                      {Math.round(analytics.totalShiftsLastWeek / 7)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Clock-ins Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📊 Daily Clock-ins (Last 7 Days)
              </h3>
              <div className="space-y-3">
                {analytics.dailyClockIns.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="bg-gray-200 rounded-full h-4 relative">
                        <div
                          className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(day.count * 10, 5)}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {day.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                🔄 Recent Completed Shifts
              </h3>
              <div className="space-y-3">
                {analytics.shiftsLastWeek.slice(0, 5).map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatUserName(shift.user)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {shift.organization.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {calculateShiftDuration(
                          shift.clock_in_time,
                          shift.clock_out_time
                        )}
                        h
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(shift.clock_out_time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Staff Tab */}
        {activeTab === "active" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                🟢 Currently Active Staff ({activeStaff.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clock-in Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeStaff.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No staff currently clocked in
                      </td>
                    </tr>
                  ) : (
                    activeStaff.map((staff) => {
                      const currentTime = new Date();
                      const clockInTime = new Date(staff.clock_in_time);
                      const durationHours =
                        (currentTime.getTime() - clockInTime.getTime()) /
                        (1000 * 60 * 60);

                      return (
                        <tr key={staff.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatUserName(staff.user)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {staff.user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {staff.organization.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {clockInTime.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {Math.round(durationHours * 100) / 100}h
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shift History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                📚 Staff Shift History ({staffHistory.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clock-in
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clock-out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No shift history available
                      </td>
                    </tr>
                  ) : (
                    staffHistory.map((shift) => (
                      <tr key={shift.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatUserName(shift.user)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {shift.user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shift.organization.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(shift.clock_in_time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(shift.clock_out_time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {calculateShiftDuration(
                              shift.clock_in_time,
                              shift.clock_out_time
                            )}
                            h
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ⚙️ Organization Settings
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-yellow-600 text-xl mr-3">⚠️</div>
                  <div>
                    <h4 className="font-medium text-yellow-800">
                      Location Perimeter Settings
                    </h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Feature temporarily disabled. In production, managers
                      would be able to:
                    </p>
                    <ul className="text-yellow-700 text-sm mt-2 ml-4 list-disc">
                      <li>
                        Set location perimeter radius (e.g., within 2km of
                        hospital)
                      </li>
                      <li>Update organization GPS coordinates</li>
                      <li>Configure geofencing rules</li>
                      <li>Manage staff permissions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📊 Current Organizations
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      City General Hospital
                    </h4>
                    <p className="text-sm text-gray-500">
                      Default organization for testing
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Radius: 500m
                    </p>
                    <p className="text-xs text-gray-500">Location configured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
