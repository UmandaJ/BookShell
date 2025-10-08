import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Data, setData] = useState();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `https://book-shell-backend.vercel.app/api/v1/get-book-by-id/${id}`
      );
      setData(response.data.data);
    };
    fetch();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const handleFavourite = async () => {
    try {
      const { data } = await axios.put(
        "https://book-shell-backend.vercel.app/api/v1/add-book-to-favourite",
        {},
        { headers }
      );
      alert(data.message || "Added to favourites");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to add to favourites");
    }
  };

  const handleCart = async () => {
    try {
      const { data } = await axios.put(
        "https://book-shell-backend.vercel.app/api/v1/add-to-cart",
        {},
        { headers }
      );
      alert(data.message || "Added to cart");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <>
      {Data && (
        <div className="px-4 sm:px-8 md:px-12 py-8 bg-gradient-to-b from-amber-50/60 to-white flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Image + Buttons */}
          <div className="w-full lg:w-3/6">
            <div className="flex flex-col lg:flex-row justify-around bg-gray-100 p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
              <img
                src={Data.url}
                alt={Data.title}
                className="h-[45vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] rounded object-cover shadow-sm mx-auto"
              />

              {isLoggedIn && role === "buyer" && (
                <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-start mt-6 lg:mt-0 gap-3 lg:gap-6">
                  <button
                    className="bg-white border border-red-400 rounded-full text-xl sm:text-2xl lg:text-3xl p-2 sm:p-3 text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm"
                    onClick={handleFavourite}
                    aria-label="Add to favourites"
                  >
                    <FaHeart />
                    <span className="ms-2 sm:ms-3 text-xs sm:text-sm block lg:hidden">Favourites</span>
                  </button>
                  <button
                    className="bg-yellow-400 text-white rounded-full text-xl sm:text-2xl lg:text-3xl p-2 sm:p-3 hover:bg-yellow-500 flex items-center justify-center shadow-sm"
                    onClick={handleCart}
                    aria-label="Add to cart"
                  >
                    <FaShoppingCart />
                    <span className="ms-2 sm:ms-3 text-xs sm:text-sm block lg:hidden">Add to Cart</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="p-4 w-full lg:w-3/6">
            <h1 className="text-3xl sm:text-4xl text-gray-900 font-bold">{Data.title}</h1>
            <p className="text-gray-600 mt-1 text-base sm:text-lg font-semibold">by {Data.author}</p>
            <p className="text-gray-900 mt-4 text-base sm:text-lg leading-relaxed">
              {Data.desc}
            </p>

            <div className="mt-6 flex items-center gap-3 sm:gap-4">
              <span className="px-3 sm:px-4 py-2 bg-gray-200 rounded text-gray-800 flex items-center gap-2">
                <GrLanguage className="text-lg sm:text-xl" />
                {Data.language}
              </span>

              <span className="px-3 sm:px-4 py-2 bg-yellow-100 border border-yellow-300 rounded text-gray-900 font-semibold">
                Rs.{Data.price}
              </span>
            </div>
          </div>
        </div>
      )}

      {!Data && (
        <div className="min-h-[100dvh] bg-amber-50/60 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;
