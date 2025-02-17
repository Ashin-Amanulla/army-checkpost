import { useState, useEffect } from "react";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";
import { PageHeader, Card, Button } from "../components/ui";
import { settingsAPI } from "../services/api";
import toast from "react-hot-toast";

function Settings() {
  const [settings, setSettings] = useState({
    rtoApiKey: "",
  });
  const [loading, setLoading] = useState(false);

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
    </div>
  );
}

export default Settings;
