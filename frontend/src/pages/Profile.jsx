import React, { useEffect, useState } from "react";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader/Loader";

const Profile = () => {
  const [Profile, setProfile] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://book-shell-backend.vercel.app/api/v1/get-user-information",
        { headers }
      );
      setProfile(response.data);
    };
    fetch();
  }, []);

  if (!Profile) {
    return (
      <div className="bg-amber-50/60 min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-amber-50/60 text-gray-900 min-h-screen px-2 md:px-12 py-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar — now always visible */}
        <aside className="w-full md:w-1/6 mb-6 md:mb-0">
          <Sidebar data={Profile} />
        </aside>

        {/* Main content */}
        <main className="w-full md:w-5/6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Profile;