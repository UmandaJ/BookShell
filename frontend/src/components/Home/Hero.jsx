import React from 'react'
import Homepageimage from '../../assets/homepage.png'
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <section className="min-h-[70vh] flex flex-col md:flex-row items-center justify-center bg-amber-50/60 pt-12 sm:pt-16 px-4 sm:px-6 lg:px-12">
      {/* Left Section */}
      <div className="w-full mb-10 md:mb-0 lg:w-3/6 flex flex-col items-center lg:items-start justify-center text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-yellow-900 leading-tight max-w-2xl">
          A Smart Way to Sell What You've Read and Buy What You'll Love
        </h1>
        <h3 className="mt-4 text-base sm:text-lg lg:text-xl text-gray-900 max-w-xl">
          List your finished books, connect with fellow readers and discover affordable stories waiting for their next home. Simple, sustainable and made for book lovers like you.
        </h3>
        <div className="mt-8">
          <Link
            to="/all-books"
            className="text-base sm:text-lg lg:text-xl font-semibold bg-green-400 text-gray-900 px-8 sm:px-10 py-3 rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transition-colors"
          >
            Discover Books
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-3/6 h-full flex items-center justify-center mt-6 md:mt-0">
        <img
          src={Homepageimage}
          alt="hero"
          className="max-h-[55vh] sm:max-h-[60vh] md:max-h-[65vh] lg:max-h-[70vh] w-auto object-contain mx-auto"
          loading="lazy"
          decoding="async"
          sizes="(min-width:1024px) 40vw, (min-width:640px) 60vw, 90vw"
        />
      </div>
    </section>
  )
}

export default Hero