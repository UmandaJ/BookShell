import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const RecentlyAdded = () => {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://book-shell-backend.vercel.app/api/v1/get-recent-books"
      );
      setData(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="mt-8 px-6 bg-amber-50/60">
      {/* Section Heading */}
      <div className="flex justify-center">
        <div className="inline-block bg-yellow-200 px-6 py-2 rounded-md shadow-md">
          <h4 className="text-3xl font-bold text-gray-800">
            Recently Added Books
          </h4>
        </div>
      </div>

      {/* Loader */}
      {!Data && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}

      {/* Grid Layout */}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {Data &&
          Data.map((items, i) => (
            <div key={i}>
              <BookCard data={items} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentlyAdded;
