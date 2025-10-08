import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";
import noSearchImg from "../assets/noSearch.png";

function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const AllBooks = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (debouncedQuery.trim()) {
        // backend search returns all matches (no pagination)
        const { data: res } = await axios.get(
          "https://book-shell-backend.vercel.app/api/v1/search-books",
          { params: { q: debouncedQuery } }
        );
        setData(res.data || []);
      } else {
        // show everything when no query
        const { data: res } = await axios.get(
          "https://book-shell-backend.vercel.app/api/v1/get-all-books"
        );
        setData(res.data || []);
      }
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedQuery]);

  return (
    <div className="bg-amber-50/60 min-h-screen px-4 md:px-8 lg:px-10 py-8">
      {/* Header + Search only */}
      <div className="mx-auto w-full max-w-6xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Books</h1>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author…"
          className="w-full sm:w-80 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none"
        />
      </div>

      {/* Loader */}
      {loading && (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Empty state */}
      {!loading && data.length === 0 && (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-500 mb-6 tracking-tight">
            No Books Found
          </h1>
          <img
            src={noSearchImg}
            alt="No Search"
            className="h-[36vh] md:h-[44vh] opacity-90"
          />
        </div>
      )}

      {/* Results grid */}
      {!loading && data.length > 0 && (
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {data.map((item) => (
              <BookCard key={item._id} data={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBooks;
