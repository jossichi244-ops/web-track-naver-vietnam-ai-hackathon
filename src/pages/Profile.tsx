import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUser";
import ProfileForm from "../components/ProfileForm";
import ProfileOverview from "../components/ProfileOverview";
import Dashboard from "../components/Dashboard";
import "../assets/styles/profile.scss";
export default function Profile() {
  const { user } = useAuth();
  const { profile, updateProfile, updatePreferences, loading, error } =
    useUserProfile(user?.wallet_address ?? null);

  if (!user) return <p className="text-center">Please login first.</p>;
  if (loading) return <p className="text-center">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profile) return <p className="text-center">No profile found.</p>;

  return (
    <div className="profile-page-container">
      <div className="section-wrapper profile-form-wrapper">
        <ProfileForm
          profile={profile}
          onUpdateProfile={async (updates) => {
            await updateProfile(updates);
          }}
          onUpdatePreferences={async (prefs) => {
            await updatePreferences(prefs);
          }}
        />
      </div>

      <div className="section-wrapper profile-overview-wrapper">
        <ProfileOverview
          profile={profile}
          onUpdatePreferences={updatePreferences}
        />
      </div>

      <div className="section-wrapper dashboard-wrapper">
        <Dashboard profile={profile} tasks={profile.user_tasks ?? []} />
      </div>
    </div>
  );
}
