import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBook = () => {
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });
  const [saving, setSaving] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    try {
      const { url, title, author, price, desc, language } = Data;
      if (!url || !title || !author || !price || !desc || !language) {
        alert("All fields are required");
        return;
      }
      setSaving(true);
      const response = await axios.put(
        "http://localhost:1000/api/v1/update-book",
        Data,
        { headers }
      );
      alert(response.data.message || "Book updated");
      navigate(`/view-book-details/${id}`);
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:1000/api/v1/get-book-by-id/${id}`
      );
      setData(response.data.data || {});
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 to-white px-4 md:px-8 py-10">
      {/* 👆 added py-10 for top spacing (instead of py-0) */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Title header */}
          <div className="border-b border-gray-200 px-6 py-5">
            <h1 className="text-center text-3xl font-bold tracking-tight text-yellow-700">
              Update Book
            </h1>
          </div>

          {/* Form body */}
          <div className="px-6 py-6 space-y-5">
            {/* Image */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800">
                Image
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300"
                placeholder="URL of image"
                name="url"
                value={Data.url || ""}
                onChange={change}
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800">
                Title of the Book
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300"
                placeholder="Title of the book"
                name="title"
                value={Data.title || ""}
                onChange={change}
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800">
                Author of the Book
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300"
                placeholder="Author of the book"
                name="author"
                value={Data.author || ""}
                onChange={change}
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800">
                Language
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300"
                placeholder="Language of the book"
                name="language"
                value={Data.language || ""}
                onChange={change}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800">
                Price (Rs.)
              </label>
              <input
                type="number"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300"
                placeholder="Price of the book"
                name="price"
                value={Data.price || ""}
                onChange={change}
                min="0"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800">
                Description of Book
              </label>
              <textarea
                className="mt-2 w-full min-h-[140px] rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300"
                rows="6"
                placeholder="Description of the book"
                name="desc"
                value={Data.desc || ""}
                onChange={change}
                maxLength={2000}
              />
              <div className="mt-1 text-right text-xs text-gray-500">
                {(Data.desc?.length || 0)}/2000
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                className="w-full rounded-lg bg-yellow-500 px-4 py-3 font-semibold text-zinc-900 shadow-sm ring-1 ring-yellow-300 transition hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={submit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;