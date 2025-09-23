import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const role = useSelector((state) => state.auth.role);

  return (
    <div
      className="
        bg-gradient-to-b from-yellow-200 to-blue-200
        p-4 sm:p-6
        rounded-2xl shadow-md border border-yellow-200
        flex flex-col md:flex-col
        md:h-screen
        md:w-full
        gap-4
        md:gap-6
        md:items-center
        md:justify-between
      "
    >
      {/* Mobile: row layout */}
      <div className="flex flex-col sm:flex-col md:flex-col lg:flex-col gap-4 w-full">
        {/* Avatar and info */}
        <div className="flex flex-col md:items-center sm:items-center items-center md:w-full">
          <img
            src={data.avatar}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-yellow-300 shadow-sm object-cover"
            alt="avatar"
          />
          <div className="flex flex-col items-center sm:items-center md:items-center">
            <p className="mt-2 text-base sm:text-lg font-bold text-gray-900">
              {data.username}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">{data.email}</p>
            {/* Line below email */}
            <div className="w-16 border-b-2 border-gray-300 mt-2"></div>
          </div>
        </div>

        {/* Nav links — horizontal on mobile, vertical & centered on md+ */}
        <nav
          className="
            flex flex-row md:flex-col
            items-center md:items-center
            justify-center md:justify-center
            gap-2 md:gap-3
            w-full
          "
        >
          {role === "buyer" && (
            <>
              <NavLink
                to="/profile"
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium text-sm sm:text-base transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`
                }
              >
                Favourites
              </NavLink>
              <NavLink
                to="/profile/orderHistory"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium text-sm sm:text-base transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`
                }
              >
                Order History
              </NavLink>
              <NavLink
                to="/profile/settings"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium text-sm sm:text-base transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`
                }
              >
                Settings
              </NavLink>
            </>
          )}

          {role === "seller" && (
            <>
              <NavLink
                to="/profile"
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium text-sm sm:text-base transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`
                }
              >
                My Orders
              </NavLink>
              <NavLink
                to="/profile/my-books"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium text-sm sm:text-base transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`
                }
              >
                My Books
              </NavLink>
              <NavLink
                to="/profile/add-book"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium text-sm sm:text-base transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`
                }
              >
                Add Book
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Logout */}
      <button
        className="mt-2 md:mt-6 w-full bg-blue-500 text-white font-semibold flex items-center justify-center py-2 rounded-lg hover:bg-blue-600 transition-all text-sm sm:text-base"
        onClick={() => {
          dispatch(authActions.logout());
          dispatch(authActions.changeRole("buyer"));
          localStorage.removeItem("id");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          history("/");
        }}
      >
        Log Out <FaArrowRightFromBracket className="ml-2 text-sm sm:text-lg" />
      </button>
    </div>
  );
};

export default Sidebar;