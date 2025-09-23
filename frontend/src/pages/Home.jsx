import React from 'react'
import Hero from '../components/Home/Hero'
import RecentlyAdded from '../components/Home/RecentlyAdded'

const Home = () => {
  return (
    <div className="bg-amber-50/60 text-gray-900 px-6 md:px-10 py-8">
      <Hero />
      <RecentlyAdded />
    </div>
  )
};

export default Home