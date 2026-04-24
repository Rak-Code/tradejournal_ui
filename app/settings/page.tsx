'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { settingsSchema, SettingsInput } from '@/lib/validations';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, logout } = useAuthStore();

  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      currency: 'USD',
      timezone: 'UTC',
      notifications_enabled: true,
      email_reports: true,
    },
  });

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getSettings();
        if (response.data) {
          form.reset(response.data);
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [form]);

  const onSubmit = async (values: SettingsInput) => {
    setIsSaving(true);
    try {
      await apiClient.updateSettings(values);
      toast.success('Settings updated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update settings';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
      window.location.href = '/login';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pt-20 px-6 pb-6">
        <div className="h-8 bg-slate-200 rounded w-40 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-20 px-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Manage your trading journal preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Username</label>
              <div className="mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-medium">
                {user?.username}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <div className="mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-medium">
                {user?.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your trading journal experience</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Currency */}
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                          <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                          <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                          <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Timezone */}
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                          <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
                          <SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
                          <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                          <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                          <SelectItem value="IST">Indian Standard Time (IST)</SelectItem>
                          <SelectItem value="JST">Japan Standard Time (JST)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notifications */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-slate-900">Notifications</h3>

                <FormField
                  control={form.control}
                  name="notifications_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <FormLabel className="font-semibold">Push Notifications</FormLabel>
                        <p className="text-sm text-slate-600">
                          Receive notifications for important trading events
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email_reports"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <FormLabel className="font-semibold">Email Reports</FormLabel>
                        <p className="text-sm text-slate-600">
                          Receive weekly performance reports via email
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
