import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { FaEnvelope, FaMapMarkerAlt, FaShoppingBag, FaHeart } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";

const Settings = () => {
  const [value, setValue] = useState({ address: "" });
  const [profile, setProfile] = useState();
  const [saving, setSaving] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const role = localStorage.getItem("role") || "buyer";

  const onChange = (e) => {
    const { name, value: v } = e.target;
    setValue((prev) => ({ ...prev, [name]: v }));
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Profile
        const uRes = await axios.get("https://book-shell-backend.vercel.app/api/v1/get-user-information", { headers });
        const userPayload = uRes.data?.data ?? uRes.data ?? {};
        setProfile(userPayload);
        setValue({ address: userPayload.address || "" });

        // Orders (role-aware)
        const ordersRes =
          role === "seller"
            ? await axios.get("https://book-shell-backend.vercel.app/api/v1/get-all-orders", { headers })
            : await axios.get("https://book-shell-backend.vercel.app/api/v1/get-order-history", { headers });

        const rawOrders = ordersRes.data?.data ?? [];
        const uniqueOrders = Array.isArray(rawOrders)
          ? Object.values(
              rawOrders.reduce((acc, o) => {
                if (o && o._id) acc[o._id] = o;
                return acc;
              }, {})
            )
          : [];
        setOrdersCount(uniqueOrders.length);

        // Favourites
        const favRes = await axios.get("https://book-shell-backend.vercel.app/api/v1/get-favourite-books", { headers });
        const favs = favRes.data?.data ?? [];
        setFavCount(Array.isArray(favs) ? favs.length : 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const submitAddress = async () => {
    try {
      setSaving(true);
      const res = await axios.put("https://book-shell-backend.vercel.app/api/v1/update-address", value, { headers });
      alert(res.data?.message || "Address updated");
      setProfile((p) => ({ ...(p || {}), address: value.address }));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  const memberSince = useMemo(() => {
    const created = profile?.createdAt || profile?.created_at;
    if (!created) return null;
    try {
      return new Date(created).toLocaleDateString(undefined, { year: "numeric", month: "long" });
    } catch {
      return null;
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="w-full h-[100%] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white text-zinc-900 px-4 md:px-6">
      <div className="flex flex-col gap-6 mt-0">
        {/* Profile summary card */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-yellow-50 to-white shadow-sm p-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  profile.avatar ||
                  "https://ui-avatars.com/api/?background=FDE68A&color=7C2D12&name=" +
                    encodeURIComponent(profile.username || "U")
                }
                alt="avatar"
                className="h-20 w-20 rounded-full object-cover border-2 border-yellow-300 shadow"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{profile.username}</h2>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    <MdVerifiedUser /> {role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600 mt-1">
                  <FaEnvelope className="opacity-70" />
                  <span>{profile.email}</span>
                </div>
                {memberSince && (
                  <p className="text-xs text-zinc-500 mt-1">Member since {memberSince}</p>
                )}
              </div>
            </div>

            {/* Stats — compact boxes */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Orders (blue) */}
              <div className="h-20 rounded-lg border border-blue-200 bg-blue-50 p-3 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-blue-700">
                  <FaShoppingBag /> Orders
                </div>
                <div className="mt-1 text-xl font-bold text-blue-900">{ordersCount}</div>
              </div>
              {/* Favourites (red) */}
              <div className="h-20  rounded-lg border border-rose-200 bg-rose-50 p-3 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-rose-700">
                  <FaHeart /> Favourites
                </div>
                <div className="mt-1 text-xl font-bold text-rose-900">{favCount}</div>
              </div>
            </div>

            {/* Current address */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FaMapMarkerAlt className="text-yellow-600" />
                Current Address
              </div>
              <p className="mt-2 text-sm text-zinc-700 whitespace-pre-line">
                {profile.address || "— Not set —"}
              </p>
            </div>
          </div>
        </section>

        {/* Address form */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
            <label className="mb-2 block text-sm font-medium text-zinc-800">Address</label>
            <textarea
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 text-base font-medium
                         focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-colors resize-y min-h-[140px]"
              rows="6"
              placeholder="House No., Street, City, Postal Code, Province"
              name="address"
              value={value.address}
              onChange={onChange}
              maxLength={500}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
              <span>Tip: Include landmarks for faster delivery.</span>
              <span>{value.address.length}/500</span>
            </div>
            <div className="mt-6 flex items-center justify-end">
              <button
                className="px-6 py-2.5 rounded-lg bg-yellow-500 text-zinc-900 font-semibold hover:bg-yellow-600 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={submitAddress}
                disabled={saving || value.address.trim().length === 0}
              >
                {saving ? "Saving..." : "Update Address"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;