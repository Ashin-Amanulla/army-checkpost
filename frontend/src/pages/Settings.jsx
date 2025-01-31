import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Card, Tabs, PageHeader } from "../components/ui";
import {
  Settings as SettingsIcon,
  Palette,
  FormatSize,
  ColorLens,
} from "@mui/icons-material";
import { ChromePicker } from "react-color";

const colorPalettes = {
  military: {
    name: "Military Green",
    primary: "#4B5320",
    secondary: "#78866B",
  },
  navy: {
    name: "Navy Blue",
    primary: "#1E3D59",
    secondary: "#17314A",
  },
  desert: {
    name: "Desert Sand",
    primary: "#C19A6B",
    secondary: "#A67F5D",
  },
  saffron: {
    name: "Saffron",
    primary: "#FF9933",
    secondary: "#FF8C00",
  },
  maroon: {
    name: "Maroon",
    primary: "#800000",
    secondary: "#A52A2A",
  },
};

const fonts = [
  { value: "Inter, system-ui, sans-serif", label: "Inter (Modern)" },
  { value: "Roboto Mono, monospace", label: "Roboto Mono (Military)" },
  { value: "Courier New, monospace", label: "Courier (Military)" },
  { value: "Stencil, sans-serif", label: "Stencil (Military)" },
  { value: "Impact, sans-serif", label: "Impact (Strong)" },
];

function Settings() {
  const { theme, updateTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("theme");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(theme.colors.primary.main);

  const tabs = [
    { value: "theme", label: "Theme", icon: Palette },
    { value: "typography", label: "Typography", icon: FormatSize },
    // Add more tabs as needed
  ];

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    updateTheme({
      colors: {
        ...theme.colors,
        primary: {
          ...theme.colors.primary,
          main: color.hex,
        },
      },
    });
  };

  const handlePaletteChange = (palette) => {
    updateTheme({
      colors: {
        ...theme.colors,
        primary: {
          ...theme.colors.primary,
          main: palette.primary,
        },
        secondary: {
          ...theme.colors.secondary,
          main: palette.secondary,
        },
      },
    });
    setSelectedColor(palette.primary);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Customize your application settings"
        icon={<SettingsIcon className="w-6 h-6" />}
      />

      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "theme" && (
            <div className="space-y-8">
              {/* Color Palettes */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Color Palettes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(colorPalettes).map(([key, palette]) => (
                    <button
                      key={key}
                      onClick={() => handlePaletteChange(palette)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedColor === palette.primary
                          ? "border-green-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex space-x-2 mb-2">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: palette.secondary }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {palette.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Picker */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Custom Color
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <ColorLens className="w-5 h-5" />
                    <span>Pick a Color</span>
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </button>
                  {showColorPicker && (
                    <div className="absolute mt-2 z-10">
                      <div
                        className="fixed inset-0"
                        onClick={() => setShowColorPicker(false)}
                      />
                      <ChromePicker
                        color={selectedColor}
                        onChange={handleColorChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Preview
                </h3>
                <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <button
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: selectedColor }}
                  >
                    Sample Button
                  </button>
                  <div
                    className="p-4 rounded-md text-white"
                    style={{ backgroundColor: selectedColor }}
                  >
                    Sample Card
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-6">
              {/* Font Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Font Family
                </h3>
                <div className="grid gap-4">
                  {fonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() =>
                        updateTheme({
                          typography: {
                            ...theme.typography,
                            fontFamily: {
                              ...theme.typography.fontFamily,
                              primary: font.value,
                            },
                          },
                        })
                      }
                      className={`p-4 text-left border rounded-lg transition-all ${
                        theme.typography.fontFamily.primary === font.value
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      <h4 className="font-medium">{font.label}</h4>
                      <p className="mt-1 text-gray-600">
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Settings;
