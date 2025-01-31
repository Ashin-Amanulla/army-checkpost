import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Card, FormField, Button, Select } from "../components/ui";
import { ColorLens, FormatSize, Palette } from "@mui/icons-material";

function ThemeCustomization() {
  const { theme, updateTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState(theme.colors.primary.main);
  const [selectedFont, setSelectedFont] = useState(
    theme.typography.fontFamily.primary
  );

  const colorSchemes = [
    {
      name: "Military Green",
      primary: "#4B5320",
      secondary: "#78866B",
    },
    {
      name: "Desert Sand",
      primary: "#C19A6B",
      secondary: "#F4A460",
    },
    {
      name: "Navy Blue",
      primary: "#000080",
      secondary: "#4169E1",
    },
  ];

  const fonts = [
    { value: "Inter, system-ui, sans-serif", label: "Inter (Modern)" },
    { value: "Roboto Mono, monospace", label: "Roboto Mono (Military)" },
    { value: "Courier New, monospace", label: "Courier (Military)" },
    { value: "Stencil, sans-serif", label: "Stencil (Military)" },
    { value: "Impact, sans-serif", label: "Impact (Strong)" },
  ];

  const handleColorSchemeChange = (scheme) => {
    updateTheme({
      colors: {
        ...theme.colors,
        primary: {
          ...theme.colors.primary,
          main: scheme.primary,
        },
        secondary: {
          ...theme.colors.secondary,
          main: scheme.secondary,
        },
      },
    });
    setSelectedColor(scheme.primary);
  };

  const handleFontChange = (fontFamily) => {
    updateTheme({
      typography: {
        ...theme.typography,
        fontFamily: {
          ...theme.typography.fontFamily,
          primary: fontFamily,
        },
      },
    });
    setSelectedFont(fontFamily);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Theme Customization</h1>

      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <Palette className="w-5 h-5 mr-2" />
              Color Schemes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.name}
                  onClick={() => handleColorSchemeChange(scheme)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedColor === scheme.primary
                      ? "border-green-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex space-x-2 mb-2">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: scheme.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: scheme.secondary }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {scheme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <FormatSize className="w-5 h-5 mr-2" />
              Typography
            </h2>
            <FormField label="Primary Font">
              <Select
                value={selectedFont}
                onChange={handleFontChange}
                options={fonts}
              />
            </FormField>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" onClick={() => updateTheme(defaultTheme)}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Section */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
        <div className="space-y-4">
          <div style={{ fontFamily: selectedFont }}>
            <h1 className="text-2xl font-bold" style={{ color: selectedColor }}>
              Sample Heading
            </h1>
            <p className="text-gray-600">
              This is how your content will look with the selected theme.
            </p>
          </div>
          <Button
            variant="primary"
            style={{
              backgroundColor: selectedColor,
              borderColor: selectedColor,
            }}
          >
            Sample Button
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ThemeCustomization;
