import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector} from "react-redux";

const MobileNav = () => {
  const role = useSelector((state) => state.auth.role);

  return (
    <>
      {role === "buyer" && (
        <div className="w-full flex items-center justify-between my-4 gap-2">
          <NavLink to="/profile" end className="flex-1 text-center rounded py-2 font-semibold bg-pink-300 text-zinc-900">Favourites</NavLink>
          <NavLink to="/profile/orderHistory" className="flex-1 text-center rounded py-2 font-semibold bg-orange-300 text-zinc-900">Order History</NavLink>
          <NavLink to="/profile/settings" className="flex-1 text-center rounded py-2 font-semibold bg-green-300 text-zinc-900">Settings</NavLink>
        </div>
      )}

      {role === "seller" && (
        <div className="w-full flex items-center justify-between my-4 gap-2">
          <NavLink to="/profile" end className="flex-1 text-center rounded py-2 font-semibold bg-pink-300 text-zinc-900">My Orders</NavLink>
          <NavLink to="/profile/my-books" className="flex-1 text-center rounded py-2 font-semibold bg-orange-300 text-zinc-900">My Books</NavLink>
          <NavLink to="/profile/add-book" className="flex-1 text-center rounded py-2 font-semibold bg-green-300 text-zinc-900">Add Book</NavLink>
        </div>
      )}

      
    </>
  )
}
export default MobileNav