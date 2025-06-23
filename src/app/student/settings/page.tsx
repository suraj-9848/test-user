'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Monitor, 
  Moon, 
  Sun, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Volume2,
  Eye,
  Lock,
  Download,
  Trash2,
  Save,
  CheckCircle
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      courseUpdates: true,
      assignmentReminders: true,
      gradeNotifications: true,
      discussionReplies: true,
      systemAnnouncements: true,
      marketingEmails: false,
      weeklyDigest: true
    },
    privacy: {
      profileVisibility: 'friends',
      showOnlineStatus: true,
      allowDirectMessages: true,
      showProgress: true,
      showAchievements: true,
      dataCollection: true,
      thirdPartySharing: false
    },
    appearance: {
      theme: 'system',
      language: 'en',
      fontSize: 'medium',
      colorScheme: 'blue',
      compactMode: false,
      showAnimations: true
    },
    account: {
      twoFactorAuth: false,
      sessionTimeout: 'never',
      loginNotifications: true,
      passwordExpiry: 'never',
      downloadData: false,
      deleteAccount: false
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Simulate API call
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                      <p className="text-gray-600">Choose how you want to be notified about updates</p>
                    </div>
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>

                  <div className="space-y-6">
                    {/* Communication Methods */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Methods</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', icon: Mail, description: 'Receive notifications via email' },
                          { key: 'pushNotifications', label: 'Push Notifications', icon: Smartphone, description: 'Get notifications on your device' },
                          { key: 'smsNotifications', label: 'SMS Notifications', icon: MessageSquare, description: 'Receive text message alerts' }
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Icon className="w-5 h-5 text-gray-600" />
                                <div>
                                  <p className="font-medium text-gray-900">{item.label}</p>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                                  onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notification Types */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">What to Notify About</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'courseUpdates', label: 'Course Updates', description: 'New lessons, materials, and course changes' },
                          { key: 'assignmentReminders', label: 'Assignment Reminders', description: 'Due dates and submission reminders' },
                          { key: 'gradeNotifications', label: 'Grade Notifications', description: 'When assignments are graded' },
                          { key: 'discussionReplies', label: 'Discussion Replies', description: 'Replies to your forum posts' },
                          { key: 'systemAnnouncements', label: 'System Announcements', description: 'Important platform updates' },
                          { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional content and new course announcements' },
                          { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of your weekly activity' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                                onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                      <p className="text-gray-600">Control your privacy and data sharing preferences</p>
                    </div>
                    <Shield className="w-8 h-8 text-gray-400" />
                  </div>

                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Who can see your profile?</label>
                          <select
                            value={settings.privacy.profileVisibility}
                            onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="public">Everyone</option>
                            <option value="friends">Friends only</option>
                            <option value="private">Only me</option>
                          </select>
                        </div>

                        {[
                          { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Let others see when you\'re online' },
                          { key: 'allowDirectMessages', label: 'Allow Direct Messages', description: 'Allow other students to message you' },
                          { key: 'showProgress', label: 'Show Course Progress', description: 'Display your learning progress to others' },
                          { key: 'showAchievements', label: 'Show Achievements', description: 'Display your badges and certificates' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.privacy[item.key as keyof typeof settings.privacy]}
                                onChange={(e) => handleSettingChange('privacy', item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Data & Privacy */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Privacy</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'dataCollection', label: 'Analytics Data Collection', description: 'Help improve the platform by sharing usage data' },
                          { key: 'thirdPartySharing', label: 'Third-party Data Sharing', description: 'Share data with educational partners' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.privacy[item.key as keyof typeof settings.privacy]}
                                onChange={(e) => handleSettingChange('privacy', item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
                      <p className="text-gray-600">Customize how the platform looks and feels</p>
                    </div>
                    <Palette className="w-8 h-8 text-gray-400" />
                  </div>

                  <div className="space-y-6">
                    {/* Theme */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { key: 'light', label: 'Light', icon: Sun },
                          { key: 'dark', label: 'Dark', icon: Moon },
                          { key: 'system', label: 'System', icon: Monitor }
                        ].map((theme) => {
                          const Icon = theme.icon;
                          return (
                            <button
                              key={theme.key}
                              onClick={() => handleSettingChange('appearance', 'theme', theme.key)}
                              className={`p-4 border-2 rounded-lg transition-all ${
                                settings.appearance.theme === theme.key
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                              <p className="font-medium text-gray-900">{theme.label}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Language</h3>
                      <select
                        value={settings.appearance.language}
                        onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="hi">हिन्दी</option>
                      </select>
                    </div>

                    {/* Font Size */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Font Size</h3>
                      <div className="flex space-x-2">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSettingChange('appearance', 'fontSize', size)}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              settings.appearance.fontSize === size
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Other Options */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Display Options</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'compactMode', label: 'Compact Mode', description: 'Reduce spacing for more content on screen' },
                          { key: 'showAnimations', label: 'Show Animations', description: 'Enable smooth transitions and animations' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.appearance[item.key as keyof typeof settings.appearance]}
                                onChange={(e) => handleSettingChange('appearance', item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Account Security</h2>
                      <p className="text-gray-600">Manage your account security and data</p>
                    </div>
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>

                  <div className="space-y-6">
                    {/* Security */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                          </div>
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            {settings.account.twoFactorAuth ? 'Disable' : 'Enable'}
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Change Password</p>
                            <p className="text-sm text-gray-600">Update your account password</p>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Change
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                          <select
                            value={settings.account.sessionTimeout}
                            onChange={(e) => handleSettingChange('account', 'sessionTimeout', e.target.value)}
                            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="15min">15 minutes</option>
                            <option value="30min">30 minutes</option>
                            <option value="1hour">1 hour</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Data Management */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Download className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">Download Your Data</p>
                              <p className="text-sm text-gray-600">Get a copy of all your data</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Download
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Trash2 className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="font-medium text-red-900">Delete Account</p>
                              <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {saved && (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">Settings saved successfully!</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
