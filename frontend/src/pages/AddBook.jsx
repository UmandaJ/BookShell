import React, { useState } from "react";
import axios from "axios";

const AddBook = () => {
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const response = await axios.post(
        "https://book-shell-backend.vercel.app/api/v1/add-book",
        Data,
        { headers }
      );
      setData({ url: "", title: "", author: "", price: "", desc: "", language: "" });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    
    <div className="min-h-screen bg-amber-50/60 px-4 md:px-8 py-0">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mt-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Title */}
          <div className="border-b border-gray-200 px-6 py-5">
            <h1 className="text-center text-3xl font-bold tracking-tight text-yellow-700">
              Add Book
            </h1>
          </div>

          {/* Form */}
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
                value={Data.url}
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
                value={Data.title}
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
                value={Data.author}
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
                value={Data.language}
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
                value={Data.price}
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
                rows="5"
                placeholder="Description of the book"
                name="desc"
                value={Data.desc}
                onChange={change}
                maxLength={2000}
              />
              <div className="mt-1 text-right text-xs text-gray-500">
                {Data.desc.length}/2000
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                className="w-full rounded-lg bg-yellow-500 px-4 py-3 font-semibold text-zinc-900 shadow-sm ring-1 ring-yellow-300 transition hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onClick={submit}
              >
                Add Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
