// frontend/src/pages/MyBooks.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import noBookImg from "../assets/noBook.png";
import Loader from "../components/Loader/Loader";

const MyBooks = () => {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchMine = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:1000/api/v1/get-my-books",
        { headers }
      );
      setBooks(data?.data || []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load your books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteBook = async (bookId) => {
    if (!confirm("Delete this book?")) return;
    try {
      await axios.delete("http://localhost:1000/api/v1/delete-book", {
        headers: { ...headers, bookid: bookId },
      });
      setBooks((prev) => (prev || []).filter((b) => b._id !== bookId));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

 

  return (
    <div className="w-full bg-amber-50/60 px-4 md:px-8 lg:px-12 pt-0">
      {!books && (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="flex justify-center">
  
      </div>

      {/* Empty state */}
      {books && books.length === 0 && (
       <div className="p-4 text-gray-700 flex flex-col items-center justify-center min-h-screen">
           <h1 className="text-5xl font-semibold text-gray-500 mb-8">No Books Yet</h1>
          <img src={noBookImg} alt="No books" className="h-[40vh]" />
        </div>
      )}

      {/* Grid — same as Favourites (4 per row on lg) */}
      {books && books.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((b) => (
            <div
              key={b._id}
              className="group relative rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-lg hover:ring-yellow-400"
            >
              {/* Clickable area to view details */}
              <Link
                to={`/view-book-details/${b._id}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded-2xl"
              >
                {/* Image (same block as BookCard) */}
                <div className="overflow-hidden rounded-t-2xl bg-gray-50">
                  <div className="flex h-56 items-center justify-center">
                    <img
                      src={b.url}
                      alt={b.title}
                      className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Content (same spacing & typography as BookCard) */}
                <div className="space-y-2 rounded-b-2xl p-4">
                  <h2 className="font-semibold text-gray-900 text-lg line-clamp-1">
                    {b.title}
                  </h2>
                  <p className="mt-1 text-gray-600 text-sm">by {b.author}</p>
                  <p className="mt-2 text-yellow-600 font-bold text-xl">Rs.{b.price}</p>
                </div>
              </Link>

              {/* Footer actions — replaces the favourites button */}
              <div className="border-t border-gray-100 p-4 flex items-center justify-between gap-3">
                <Link
                  to={`/updateBook/${b._id}`}
                  className="inline-flex w-1/2 items-center justify-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:border-blue-400 hover:bg-blue-100 active:scale-[0.99]"
                  title="Edit this book"
                >
                  <FaEdit className="text-base" />
                  Update
                </Link>
                <button
                  onClick={() => deleteBook(b._id)}
                  className="inline-flex w-1/2 items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:border-red-400 hover:bg-red-100 active:scale-[0.99]"
                  title="Delete this book"
                >
                  <MdOutlineDelete className="text-lg" />
                   Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;