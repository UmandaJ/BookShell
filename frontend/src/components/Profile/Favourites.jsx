import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import notfoundImg from "../../assets/notfound.png";
import Loader from "../Loader/Loader";

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://book-shell-backend.vercel.app/api/v1/get-favourite-books",
        { headers }
      );
      setFavouriteBooks(response.data.data);
    };
    fetch();
  }, []);

  // Remove a book 
  const handleRemovedFromFav = (bookId) => {
    setFavouriteBooks((prev) => (prev || []).filter((b) => b && b._id !== bookId));
  };

  return (
    <section className="w-full bg-amber-50/60 py-6">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Loader */}
        {!FavouriteBooks && (
          <div className="w-full min-h-screen flex items-center justify-center" aria-live="polite">
            <Loader />
          </div>
        )}

        {/* Empty state */}
        {FavouriteBooks && FavouriteBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full min-h-screen text-center">
            <p className="text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-600">
              No Favourite Books
            </p>
            <img
              src={notfoundImg}
              alt="Not Found"
              className="h-48 sm:h-56 md:h-[40vh] my-8 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {/* Grid — scales 1→2→3→4 columns */}
        {FavouriteBooks && FavouriteBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {(FavouriteBooks || []).map((item) => (
              <div key={item._id} className="h-full">
                <BookCard
                  data={item}
                  favourite={true}
                  onRemoved={handleRemovedFromFav}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Favourites;
