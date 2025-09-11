import { useEffect, useState } from "react";
import type { UserProfile } from "../types";
import "../assets/styles/profile-form.scss";
// import ShareChallengeForm from "./ShareChallengeForm";

interface Props {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onUpdatePreferences: (
    prefs: Partial<UserProfile["preferences"]>
  ) => Promise<void>;
}

export default function ProfileForm({
  profile,
  onUpdateProfile,
  onUpdatePreferences,
}: Props) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [theme, setTheme] = useState(profile.preferences?.theme ?? "light");
  const [notifications, setNotifications] = useState(
    profile.preferences?.notifications ?? true
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔄 Khi profile thay đổi (refetch), đồng bộ state
  useEffect(() => {
    setDisplayName(profile.display_name ?? "");
    setAvatarUrl(profile.avatar_url ?? "");
    setTheme(profile.preferences?.theme ?? "light");
    setNotifications(profile.preferences?.notifications ?? true);
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await onUpdateProfile({
        display_name: displayName || undefined,
        avatar_url: avatarUrl || undefined,
      });
      setMessage("✅ Profile updated successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await onUpdatePreferences({
        theme,
        notifications,
      });
      setMessage("✅ Preferences saved!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("❌ Failed to update preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveProfile} className="profile-form">
      <h2>Edit Profile</h2>
      {message && <div className="message">{message}</div>}
      <div>
        <label htmlFor="displayName">Display Name</label>
        <input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your display name"
          type="text"
          autoComplete="off"
          disabled={saving}
        />
      </div>
      <div>
        <label htmlFor="avatarUrl">Avatar URL</label>
        <input
          id="avatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://example.com/avatar.png"
          type="url"
          autoComplete="off"
          disabled={saving}
        />
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar Preview"
            className="avatar-preview"
          />
        )}
      </div>
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Profile"}
      </button>
      <hr />
      {/* <h3>Preferences</h3> */}
      {/* <div>
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          value={theme}
          onChange={(e) =>
            setTheme(e.target.value as "light" | "dark" | "auto")
          }
          disabled={saving}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div> */}
      {/* <div className="checkbox-label">
        <input
          id="notifications"
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
          disabled={saving}
        />
        <label htmlFor="notifications">Enable Notifications</label>
      </div> */}
      <button type="button" onClick={handleSavePreferences} disabled={saving}>
        {saving ? "Saving..." : "Save Preferences"}
      </button>{" "}
    </form>
  );
}
