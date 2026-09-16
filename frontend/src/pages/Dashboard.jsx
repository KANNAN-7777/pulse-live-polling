import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Connect to your existing auth profile endpoint
        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data.user || response.data);
      } catch (err) {
        console.error(err);
        setError("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-50 border-t-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-12 animate-fade-in">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back{profile?.name ? `, ${profile.name}` : ""}!
            </h1>
            <p className="mt-2 text-gray-500">
              Manage your live polls and view real-time results.
            </p>
          </div>
          <Link
            to="/create"
            className="rounded-2xl bg-green-500 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md"
          >
            + Create New Poll
          </Link>
        </div>

        {/* Quick Stats / Actions */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: '50ms' }}>
          
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Start a Poll</h3>
            <p className="mb-4 text-sm text-gray-500">Create a new question and share it with your audience instantly.</p>
            <Link to="/create" className="text-sm font-semibold text-green-600 hover:text-green-700">
              Create now &rarr;
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Profile Details</h3>
            <p className="mb-4 text-sm text-gray-500 text-truncate">
              Logged in as: <span className="font-medium text-gray-900">{profile?.email || 'User'}</span>
            </p>
            <button className="text-sm font-semibold text-gray-400 cursor-not-allowed">
              Edit profile (Coming soon)
            </button>
          </div>

        </div>

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;