import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BookCard = ({ data, favourite, onRemoved }) => {
  const [removing, setRemoving] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data._id,
  };

  const handleRemoveBook = async () => {
    try {
      setRemoving(true);
      const { data: res } = await axios.put(
        "http://localhost:1000/api/v1/remove-book-from-favourite",
        {},
        { headers }
      );
      alert(res.message || "Removed from favourites");
      // notify parent to update UI without refresh
      onRemoved?.(data._id);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to remove from favourites");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="group relative rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-lg hover:ring-yellow-400">
      <Link
        to={`/view-book-details/${data._id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded-2xl"
      >
        {/* Image */}
        <div className="overflow-hidden rounded-t-2xl bg-gray-50">
          <div className="flex h-56 items-center justify-center">
            <img
              src={data.url}
              alt={data.title || "Book cover"}
              className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 rounded-b-2xl p-4">
          <h2 className="font-semibold text-gray-900 text-lg line-clamp-1">
            {data.title}
          </h2>
          <p className="mt-1 text-gray-600 text-sm">by {data.author}</p>
          <p className="mt-2 text-yellow-600 font-bold text-xl">Rs.{data.price}</p>
        </div>
      </Link>

      {/* Footer actions */}
      {favourite && (
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleRemoveBook}
            disabled={removing}
            className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:border-red-400 hover:bg-red-100 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {"Remove from favourites"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCard;