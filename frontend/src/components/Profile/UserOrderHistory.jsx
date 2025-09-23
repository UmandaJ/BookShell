import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import noorderImg from "../../assets/noorder.png";
import { Link } from "react-router-dom";

const UserOrderHistory = () => {
  const [OrderHistory, setOrderHistory] = useState();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-order-history",
          { headers }
        );
        setOrderHistory(response.data.data);
      } catch (err) {
        console.error(err);
        setOrderHistory([]);
      }
    };
    fetch();
  }, []);

  return (
    <section className="bg-amber-50/60 min-h-[100dvh]">
      {/* Loading */}
      {!OrderHistory && (
        <div className="w-full min-h-screen flex items-center justify-center" aria-live="polite">
          <Loader />
        </div>
      )}

      {/* Empty state */}
      {OrderHistory && OrderHistory.length === 0 && (
        <div className="px-4 py-10 text-gray-700 flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-600 mb-6">
            No Order History
          </h1>
          <img
            src={noorderImg}
            alt="No orders"
            className="h-48 sm:h-56 md:h-[40vh] w-auto mb-8 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      {/* Table */}
      {OrderHistory && OrderHistory.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 text-gray-900">
          <div className="overflow-x-auto">
            <div className="min-w-[720px] space-y-2">
              {/* Headers */}
              <div className="bg-gray-100 rounded py-2 px-3 sm:px-4 flex gap-2 font-semibold text-gray-700 border border-gray-300 text-xs sm:text-sm">
                <div className="w-[3%] text-center">Sr.</div>
                <div className="w-[22%]">Books</div>
                {/* centered header for Description */}
                <div className="w-[45%] text-center">Description</div>
                <div className="w-[9%]">Price</div>
                <div className="w-[16%]">Status</div>
                <div className="hidden md:block md:w-[5%]">Mode</div>
              </div>

              {/* Rows */}
              {OrderHistory.map((items, i) => {
                if (!items || !items.book) return null;
                const book = items.book;
                return (
                  <div
                    key={items._id || i}
                    className="bg-white rounded py-2 px-3 sm:px-4 flex gap-2 sm:gap-4 border border-gray-200 hover:border-yellow-400 hover:shadow-md transition duration-200 cursor-pointer"
                  >
                    <div className="w-[3%] text-center text-xs sm:text-sm">{i + 1}</div>

                    <div className="w-[25%] font-medium text-gray-900 text-xs sm:text-sm truncate">
                      <Link
                        to={`/view-book-details/${book._id}`}
                        className="hover:text-yellow-600"
                        title={book.title}
                      >
                        {book.title}
                      </Link>
                    </div>

                    {/* left-aligned + nudged slightly left */}
                    <div className="w-[45%] text-gray-600 text-left -ml-1 sm:-ml-2 text-xs sm:text-sm">
                      {(book.desc || "").slice(0, 60)}
                      {(book.desc || "").length > 60 ? "…" : ""}
                    </div>

                    <div className="w-[9%] font-semibold text-gray-800 text-xs sm:text-sm">
                      Rs.{book.price}
                    </div>

                    <div className="w-[16%] font-semibold text-xs sm:text-sm">
                      {items.status === "Order Placed" ? (
                        <span className="text-yellow-600">{items.status}</span>
                      ) : items.status === "Canceled" ? (
                        <span className="text-red-500">{items.status}</span>
                      ) : (
                        items.status
                      )}
                    </div>

                    <div className="hidden md:block md:w-[5%] text-gray-500 text-xs sm:text-sm">
                      <span>COD</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserOrderHistory;