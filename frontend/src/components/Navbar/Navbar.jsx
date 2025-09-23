import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Base links shown to everyone
  const baseLinks = useMemo(
    () => [
      { title: "Home", link: "/" },
      { title: "All Books", link: "/all-books" },
    ],
    []
  );

  // Build links based on auth + role
  const visibleLinks = useMemo(() => {
    if (!isLoggedIn) return baseLinks;

    if (role === "seller") {
      return [
        ...baseLinks,
        
        { title: "Seller Dashboard", link: "/profile" },
      ];
    }

    // default: logged-in regular user
    return [
      ...baseLinks,
      { title: "Cart", link: "/cart" },
      { title: "Profile", link: "/profile" },
    ];
  }, [isLoggedIn, role, baseLinks]);

  return (
    <>
      {/* Top Navbar */}
      <nav className="z-50 relative flex bg-yellow-800 text-white px-6 py-2 items-center justify-between">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center">
          <img className="h-12 mr-3" src={logo} alt="logo" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#f5aa42] to-[#b59d06] bg-clip-text text-transparent">
            BookShell
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {visibleLinks.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className={`text-white text-lg font-medium transition ${
                item.title.includes("Profile")
                  ? "border border-yellow-500 px-3 py-1 rounded hover:bg-white hover:text-black"
                  : "hover:text-yellow-300"
              }`}
            >
              {item.title}
            </Link>
          ))}

          {/* Auth buttons when NOT logged in */}
          {!isLoggedIn && (
            <div className="flex items-center gap-3">
              <Link
                to="/LogIn"
                className="px-4 py-1 border border-white rounded hover:bg-white hover:text-zinc-800 transition"
              >
                LogIn
              </Link>
              <Link
                to="/SignUp"
                className="px-4 py-1 bg-yellow-500 rounded hover:bg-white hover:text-zinc-800 transition"
              >
                SignUp
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="block md:hidden text-white text-2xl hover:text-zinc-300"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Open navigation"
        >
          <FaGripLines />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`${
          mobileOpen ? "flex" : "hidden"
        } bg-zinc-800 h-screen fixed top-0 left-0 w-full z-40 flex-col items-center justify-center gap-8`}
      >
        {visibleLinks.map((item, i) => (
          <Link
            key={i}
            to={item.link}
            className="text-white text-3xl font-semibold hover:text-yellow-300 transition"
            onClick={() => setMobileOpen(false)}
          >
            {item.title}
          </Link>
        ))}

        {!isLoggedIn && (
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/LogIn"
              className="px-8 py-2 border border-white rounded text-white hover:bg-white hover:text-zinc-800 transition text-2xl"
              onClick={() => setMobileOpen(false)}
            >
              LogIn
            </Link>
            <Link
              to="/SignUp"
              className="px-8 py-2 bg-yellow-500 rounded hover:bg-white hover:text-zinc-800 transition text-2xl"
              onClick={() => setMobileOpen(false)}
            >
              SignUp
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar