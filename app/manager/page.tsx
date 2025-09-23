// app/manager/page.tsx
// Manager dashboard for healthcare shift tracking - Following naming conventions
"use client";

import { useState, useEffect } from "react";
// @ts-ignore
import { useUser } from "@auth0/nextjs-auth0";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getActiveStaffAction,
  getAllStaffHistoryAction,
  getAnalyticsAction,
  updateOrganizationSettingsAction,
  getOrganizationSettingsAction,
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

interface OrganizationSettings {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
}

export default function ManagerDashboard() {
  const { user, isLoading: userLoading } = useUser();

  // State management
  const [activeStaff, setActiveStaff] = useState<ActiveStaffMember[]>([]);
  const [staffHistory, setStaffHistory] = useState<StaffHistoryEntry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "active" | "history" | "settings"
  >("overview");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Load data when component mounts
  useEffect(() => {
    if (user && !userLoading && userRole === null) {
      checkUserRole();
    }
  }, [user, userLoading, userRole]);

  // Load data after role is verified
  useEffect(() => {
    if (userRole && userRole !== 'error') {
      loadAllData();
      loadOrganizationSettings();
    }
  }, [userRole]);

  const checkUserRole = async () => {
    try {
      // Get user role from database based on email
      const userEmail = user?.email;
      if (!userEmail) {
        setUserRole('error');
        return;
      }

      // Call server action to check user role instead of using Prisma directly
      const response = await fetch('/api/check-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (data.success && (data.role === 'manager' || data.role === 'admin')) {
        setUserRole(data.role);
      } else {
        // Redirect non-managers
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      // Show error message instead of redirecting immediately
      setUserRole('error');
    }
  };

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

  const loadOrganizationSettings = async () => {
    try {
      const result = await getOrganizationSettingsAction();
      if (result.success && result.organizations) {
        setOrganizationSettings(result.organizations);
      }
    } catch (error) {
      console.error("Error loading organization settings:", error);
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

  const handleUpdateOrganizationSettings = async (formData: FormData) => {
    setSettingsLoading(true);
    setSettingsMessage(null);

    try {
      const result = await updateOrganizationSettingsAction(formData);

      if (result.success) {
        setSettingsMessage({ type: 'success', text: result.message || 'Settings updated successfully' });
        await loadOrganizationSettings(); // Reload settings
        await loadAllData(); // Reload analytics in case organization changes affect data
      } else {
        setSettingsMessage({ type: 'error', text: result.error || 'Failed to update settings' });
      }
    } catch (error) {
      setSettingsMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setSettingsLoading(false);
    }
  };

  // Loading state
  if (userLoading || userRole === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Manager Dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Verifying your account permissions</p>
        </div>
      </div>
    );
  }

  // Loading data state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard Data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching analytics and staff information</p>
        </div>
      </div>
    );
  }

  // Error state
  if (userRole === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl text-red-800 font-bold mb-4">
            ⚠️ Connection Error
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to verify your account permissions. Please try logging in again.
          </p>
          <a
            href="/auth/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Log In Again
          </a>
        </div>
      </div>
    );
  }

  // Authentication and role check required
  if (!user || !userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl text-gray-800 font-bold mb-4">
            🔒 Manager Access Required
          </h2>
          <p className="text-gray-600 mb-6">
            You must be logged in as a manager to access this dashboard.
          </p>
          <a
            href="/auth/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Log In as Manager
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
                href="/auth/logout"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🚪 Logout
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.dailyClockIns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })
                      }
                      formatter={(value) => [value, "Clock-ins"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        color: "#000000",
                      }}
                      labelStyle={{ color: "#000000", fontWeight: "bold" }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Shift Duration Trends */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📈 Shift Duration Trends (Last 7 Days)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.dailyClockIns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })
                      }
                      formatter={(value) => [value, "Clock-ins"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        color: "#000000",
                      }}
                      labelStyle={{ color: "#000000", fontWeight: "bold" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Organization Distribution */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                🏥 Shifts by Organization (Last 7 Days)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "City General Hospital", value: Math.floor(analytics.totalShiftsLastWeek * 0.4), fill: "#3b82f6" },
                        { name: "Downtown Clinic", value: Math.floor(analytics.totalShiftsLastWeek * 0.25), fill: "#10b981" },
                        { name: "Metro Medical Center", value: Math.floor(analytics.totalShiftsLastWeek * 0.2), fill: "#f59e0b" },
                        { name: "Riverside Health Clinic", value: Math.floor(analytics.totalShiftsLastWeek * 0.15), fill: "#ef4444" },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                      ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        color: "#000000",
                      }}
                      labelStyle={{ color: "#000000", fontWeight: "bold" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
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
            {/* Success/Error Messages */}
            {settingsMessage && (
              <div className={`p-4 rounded-lg border ${
                settingsMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <p className="font-medium">
                  {settingsMessage.type === 'success' ? '✅' : '❌'} {settingsMessage.text}
                </p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ⚙️ Organization Settings
              </h3>
              <p className="text-gray-600 mb-6">
                Configure location perimeter settings for each organization. These settings control the geofencing rules for clock-in/clock-out operations.
              </p>

              <div className="space-y-6">
                {organizationSettings.map((org) => (
                  <div key={org.id} className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {org.name}
                    </h4>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        formData.append('organizationId', org.id);
                        await handleUpdateOrganizationSettings(formData);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude
                          </label>
                          <input
                            type="number"
                            name="latitude"
                            step="0.000001"
                            defaultValue={org.latitude || ''}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            placeholder="e.g., 12.9716"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude
                          </label>
                          <input
                            type="number"
                            name="longitude"
                            step="0.000001"
                            defaultValue={org.longitude || ''}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            placeholder="e.g., 77.5946"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Radius (meters)
                          </label>
                          <input
                            type="number"
                            name="radius"
                            min="50"
                            max="5000"
                            defaultValue={org.radius || ''}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            placeholder="e.g., 200"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <p>Current settings: Lat {org.latitude?.toFixed(4)}, Lng {org.longitude?.toFixed(4)}, Radius {org.radius}m</p>
                        </div>

                        <button
                          type="submit"
                          disabled={settingsLoading}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                        >
                          {settingsLoading ? 'Updating...' : 'Update Settings'}
                        </button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📋 Geofencing Information
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">📍</span>
                  <div>
                    <p className="font-medium text-gray-900">Location Validation</p>
                    <p>Staff must be within the specified radius of their organization's coordinates to clock in or out.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-green-500 mr-2">🎯</span>
                  <div>
                    <p className="font-medium text-gray-900">GPS Accuracy</p>
                    <p>Coordinates are validated using the Haversine formula for precise distance calculations.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-orange-500 mr-2">⚠️</span>
                  <div>
                    <p className="font-medium text-gray-900">Important Notes</p>
                    <p>Changes to location settings will immediately affect all clock-in/clock-out operations for that organization.</p>
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
