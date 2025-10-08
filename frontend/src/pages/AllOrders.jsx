import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { Link } from "react-router-dom";
import { FaCheck, FaUserLarge } from "react-icons/fa6";
import { IoOpenOutline } from "react-icons/io5";
import SeeUserData from "./SeeUserData";
import noorderImg from "../assets/noorder.png";

const AllOrders = () => {
  const [orders, setOrders] = useState(null);
  const [optionsOpenIndex, setOptionsOpenIndex] = useState(-1);
  const [pendingStatus, setPendingStatus] = useState("");
  const [userDiv, setUserDiv] = useState("hidden");
  const [userDivData, setUserDivData] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://book-shell-backend.vercel.app/api/v1/get-all-orders", { headers });
        setOrders(res.data.data || []);
      } catch (e) {
        console.error(e);
        setOrders([]); // avoid spinner on error
      }
    })();
  }, []);

  const openOptions = (rowIndex) => {
    setOptionsOpenIndex(rowIndex);
    setPendingStatus(orders[rowIndex]?.status || "");
  };

  const submitChanges = async (rowIndex) => {
    try {
      const id = orders[rowIndex]._id;
      const res = await axios.put(
        `https://book-shell-backend.vercel.app/api/v1/update-order-status/${id}`,
        { status: pendingStatus },
        { headers }
      );

      setOrders((prev) =>
        prev.map((o, i) => (i === rowIndex ? { ...o, status: pendingStatus } : o))
      );
      setOptionsOpenIndex(-1);
      alert(res.data?.message || "Order status updated");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  if (!orders) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-amber-50/60">
        <Loader />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="px-4 py-10 text-gray-700 flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-600 mb-6">
          No Orders Yet
        </h1>
        <img src={noorderImg} alt="No orders" className="h-48 sm:h-56 md:h-[40vh] w-auto object-contain" />
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-b from-amber-50/60 to-white min-h-[100dvh]">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 text-gray-900">
          {/* Horizontal scroll wrapper keeps layout intact on small screens */}
          <div className="overflow-x-auto">
            {/* Keep table readable on phones via a minimum width */}
            <div className="min-w-[820px] space-y-2">
              {/* Table headers (aligned with UserOrderHistory style) */}
              <div className="bg-gray-100 rounded py-2 px-3 sm:px-4 flex gap-2 font-semibold text-gray-700 border border-gray-300 text-xs sm:text-sm">
                <div className="w-[3%] text-center">Sr.</div>
                <div className="w-[22%]">Books</div>
                <div className="w-[45%] text-center">Description</div>
                <div className="w-[9%]">Price</div>
                <div className="w-[16%]">Status</div>
                <div className="hidden md:flex md:w-[5%] items-center justify-center">
                  <FaUserLarge />
                </div>
              </div>

              {/* Rows */}
              {orders.map((item, i) => {
                if (!item?.book) return null;

                const savedStatus = item.status;
                const showingEditor = optionsOpenIndex === i;
                const saveDisabled = pendingStatus === savedStatus;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded py-2 px-3 sm:px-4 flex gap-2 sm:gap-4 border border-gray-200 hover:border-yellow-400 hover:shadow-md transition duration-200"
                  >
                    {/* Sr. */}
                    <div className="w-[3%] text-center text-xs sm:text-sm">{i + 1}</div>

                    {/* Book title */}
                    <div className="w-[25%] font-medium text-gray-900 text-xs sm:text-sm truncate">
                      <Link
                        to={`/view-book-details/${item.book._id}`}
                        className="hover:text-yellow-600"
                        title={item.book.title}
                      >
                        {item.book.title}
                      </Link>
                    </div>

                    {/* Description: left-aligned for readability */}
                    <div className="w-[45%] text-gray-600 text-left text-xs sm:text-sm">
                      {(item.book.desc || "").slice(0, 60)}
                      {(item.book.desc || "").length > 60 ? "…" : ""}
                    </div>

                    {/* Price */}
                    <div className="w-[9%] font-semibold text-gray-800 text-xs sm:text-sm">
                      Rs.{item.book.price}
                    </div>

                    {/* Status + inline editor */}
                    <div className="w-[16%] font-semibold text-xs sm:text-sm">
                      <button
                        className="hover:scale-[1.02] transition-transform"
                        onClick={() => openOptions(i)}
                        title="Change status"
                      >
                        <span
                          className={
                            savedStatus === "Canceled"
                              ? "text-red-500"
                              : savedStatus === "Order Placed"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {savedStatus}
                        </span>
                      </button>

                      <div className={showingEditor ? "flex items-center gap-2 mt-2" : "hidden"}>
                        <select
                          className="bg-gray-100 border border-gray-300 text-gray-800 px-2 py-1 rounded text-xs sm:text-sm"
                          value={pendingStatus}
                          onChange={(e) => setPendingStatus(e.target.value)}
                        >
                          {["Order Placed", "Out for delivery", "Delivered", "Canceled"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <button
                          className={`${
                            saveDisabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-green-600 hover:text-green-700"
                          }`}
                          onClick={() => !saveDisabled && submitChanges(i)}
                          disabled={saveDisabled}
                          title={saveDisabled ? "No change to save" : "Save"}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    </div>

                    {/* View user */}
                    <div className="hidden md:flex md:w-[5%] items-center justify-center">
                      <button
                        className="text-lg sm:text-xl text-gray-700 hover:text-orange-500"
                        onClick={() => {
                          setUserDiv("fixed");
                          setUserDivData(item.user);
                        }}
                        title="View user"
                      >
                        <IoOpenOutline />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setuserDiv={setUserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;
