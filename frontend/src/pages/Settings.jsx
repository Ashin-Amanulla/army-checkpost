import { useState } from "react";
import {
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";
import { PageHeader, Card, Button } from "../components/ui";

function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Customize your application settings"
        icon={<SettingsIcon className="w-6 h-6" />}
      />

      <Card>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Application Settings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure your application preferences
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Settings;
