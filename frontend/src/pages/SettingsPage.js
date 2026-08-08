// ============================================================
// Settings Page — App Configuration
// ============================================================
import React, { useState } from "react";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    appName: "Library Pro",
    itemsPerPage: 10,
    defaultCategory: "",
    enableNotifications: true,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("librarySettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    localStorage.removeItem("librarySettings");
    setSettings({
      appName: "Library Pro",
      itemsPerPage: 10,
      defaultCategory: "",
      enableNotifications: true,
    });
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your library application</p>
      </div>

      <div className="settings-card">
        <form onSubmit={handleSave}>
          <div className="settings-section">
            <h3>General Settings</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Application Name</label>
                <input
                  type="text"
                  name="appName"
                  className="form-input"
                  value={settings.appName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Items Per Page</label>
                <input
                  type="number"
                  name="itemsPerPage"
                  className="form-input"
                  value={settings.itemsPerPage}
                  onChange={handleChange}
                  min="5"
                  max="50"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Default Category Filter</label>
                <input
                  type="text"
                  name="defaultCategory"
                  className="form-input"
                  value={settings.defaultCategory}
                  onChange={handleChange}
                  placeholder="Leave empty for all"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleChange}
                  />
                  <span>Enable Success Notifications</span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>About</h3>
            <div className="about-info">
              <div className="detail-row">
                <span className="detail-label">Version</span>
                <span className="detail-value">2.0.0</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Frontend</span>
                <span className="detail-value">React 19 + Recharts</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Backend</span>
                <span className="detail-value">Node.js + Express + MySQL</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset to Defaults
            </button>
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </form>

        {saved && (
          <div className="notification notification-success" style={{ marginTop: 16 }}>
            Settings saved successfully!
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SettingsPage;

