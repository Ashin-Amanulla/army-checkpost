import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";
import { PageHeader, Card, Button, Modal } from "../components/ui";
import { settingsAPI } from "../services/api";
import toast from "react-hot-toast";

function Settings() {
  const [settings, setSettings] = useState({
    rtoApiKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      if (response.success) {
        setSettings(response.data || {});
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsAPI.updateSettings(settings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleFactoryReset = async () => {
    setShowResetModal(false);
    setResetLoading(true);
    try {
      await settingsAPI.factoryReset();
      toast.success("Factory reset completed successfully");
    } catch (error) {
      console.error("Error performing factory reset:", error);
      toast.error("Failed to perform factory reset");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage application settings"
        icon={<SettingsIcon className="w-6 h-6" />}
      />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              RTO API Key
            </label>
            <input
              type="text"
              value={settings.rtoApiKey || ""}
              onChange={(e) =>
                setSettings({ ...settings, rtoApiKey: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="max-w-2xl border-red-200 bg-red-50">
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <WarningIcon className="w-6 h-6 text-red-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-700">
                Factory Reset
              </h3>
              <p className="mt-1 text-sm text-red-600">
                This action will permanently delete all data from the system
                except superadmin users. This includes:
              </p>
              <ul className="mt-2 text-sm text-red-600 list-disc list-inside space-y-1">
                <li>All vehicle entries and history</li>
                <li>All vehicle types</li>
                <li>All checkposts</li>
                <li>All audit logs</li>
                <li>All users except superadmin</li>
              </ul>
              <p className="mt-3 text-sm text-red-600 font-medium">
                This action cannot be undone. Please proceed with caution.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowResetModal(true)}
              disabled={resetLoading}
            >
              {resetLoading ? "Resetting..." : "Factory Reset"}
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Confirm Factory Reset"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <WarningIcon className="w-6 h-6 text-red-500 mt-1" />
            <div>
              <p className="text-red-600">
                Are you absolutely sure you want to perform a factory reset?
                This will:
              </p>
              <ul className="mt-2 text-sm text-red-600 list-disc list-inside space-y-1">
                <li>Delete all vehicle entries and history</li>
                <li>Delete all vehicle types</li>
                <li>Delete all checkposts</li>
                <li>Delete all audit logs</li>
                <li>Delete all users except superadmin</li>
              </ul>
              <p className="mt-3 text-sm text-red-600 font-medium">
                This action cannot be undone. All data will be permanently lost.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowResetModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleFactoryReset}
              disabled={resetLoading}
            >
              {resetLoading ? "Resetting..." : "Confirm Factory Reset"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
