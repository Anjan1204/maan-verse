import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Settings as SettingsIcon, Users, BookOpen, Bell } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const AdminSettings = () => {
    const defaultSettings = {
        // General Settings
        platformName: 'MAAN-verse',
        supportEmail: 'support@maanverse.com',
        defaultLanguage: 'English',

        // User Settings
        defaultUserRole: 'student',
        emailVerificationRequired: true,
        autoApproveRegistrations: false,

        // Course Settings
        defaultCourseVisibility: 'draft',
        allowFacultyToPublish: true,
        requireAdminApproval: false,

        // Notification Settings
        emailNotificationsEnabled: true,
        pushNotificationsEnabled: false,
        notificationFrequency: 'immediate'
    };

    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('adminSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        toast.success('Settings saved successfully!');
        setHasChanges(false);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
            setSettings(defaultSettings);
            localStorage.removeItem('adminSettings');
            toast.info('Settings reset to defaults');
            setHasChanges(false);
        }
    };

    return (
        <div className="space-y-6">
            <ToastContainer theme="dark" position="top-right" />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
                    <p className="text-gray-400 mt-1">Configure your platform preferences</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <RotateCcw size={18} />
                        Reset to Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-lg ${hasChanges
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>

            {hasChanges && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                        You have unsaved changes. Click "Save Changes" to apply them.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <SettingsIcon size={24} className="text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">General Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Platform Name</label>
                            <input
                                type="text"
                                value={settings.platformName}
                                onChange={(e) => handleChange('platformName', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => handleChange('supportEmail', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Default Language</label>
                            <select
                                value={settings.defaultLanguage}
                                onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* User Settings */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Users size={24} className="text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">User Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Default User Role</label>
                            <select
                                value={settings.defaultUserRole}
                                onChange={(e) => handleChange('defaultUserRole', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                            >
                                <option value="student">Student</option>
                                <option value="faculty">Faculty</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Email Verification Required</p>
                                <p className="text-xs text-gray-400">Require users to verify email before login</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailVerificationRequired}
                                    onChange={(e) => handleChange('emailVerificationRequired', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Auto-Approve Registrations</p>
                                <p className="text-xs text-gray-400">Automatically approve new user accounts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.autoApproveRegistrations}
                                    onChange={(e) => handleChange('autoApproveRegistrations', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Course Settings */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <BookOpen size={24} className="text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Course Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Default Course Visibility</label>
                            <select
                                value={settings.defaultCourseVisibility}
                                onChange={(e) => handleChange('defaultCourseVisibility', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                            >
                                <option value="draft">Draft (Unpublished)</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Allow Faculty to Publish</p>
                                <p className="text-xs text-gray-400">Faculty can publish courses directly</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.allowFacultyToPublish}
                                    onChange={(e) => handleChange('allowFacultyToPublish', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Require Admin Approval</p>
                                <p className="text-xs text-gray-400">Courses need admin approval to publish</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.requireAdminApproval}
                                    onChange={(e) => handleChange('requireAdminApproval', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-pink-500/10 rounded-lg">
                            <Bell size={24} className="text-pink-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Notification Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Email Notifications</p>
                                <p className="text-xs text-gray-400">Send email notifications to users</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotificationsEnabled}
                                    onChange={(e) => handleChange('emailNotificationsEnabled', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Push Notifications</p>
                                <p className="text-xs text-gray-400">Send browser push notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.pushNotificationsEnabled}
                                    onChange={(e) => handleChange('pushNotificationsEnabled', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Notification Frequency</label>
                            <select
                                value={settings.notificationFrequency}
                                onChange={(e) => handleChange('notificationFrequency', e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                            >
                                <option value="immediate">Immediate</option>
                                <option value="hourly">Hourly Digest</option>
                                <option value="daily">Daily Digest</option>
                                <option value="weekly">Weekly Digest</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
