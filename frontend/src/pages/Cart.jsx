import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import emptycartImg from "../assets/emptycart.png";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [Cart, setCart] = useState();
  const [Total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch cart once on mount
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:1000/api/v1/get-user-cart", { headers });
      setCart(res.data.data);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchCart = async () => {
    const res = await axios.get("http://localhost:1000/api/v1/get-user-cart", { headers });
    setCart(res.data.data);
  };

  const deleteItem = async (bookid) => {
    const response = await axios.put(
      `http://localhost:1000/api/v1/remove-from-cart/${bookid}`,
      {},
      { headers }
    );
    alert(response.data.message);
    await refetchCart();
    if (selectedId === bookid) setSelectedId(null);
  };

  useEffect(() => {
    if (Cart && Cart.length > 0) {
      const total = Cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      setTotal(total);
    } else {
      setTotal(0);
    }
  }, [Cart]);

  const PlaceOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/place-order",
        { order: Cart },
        { headers }
      );
      alert(response.data.message);
      navigate("/profile/orderHistory");
    } catch (error) {
      console.log(error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/60 px-4 md:px-8 lg:px-12 py-8">
      {/* Loader */}
      {!Cart && (
        <div className="w-full min-h-screen flex items-center justify-center">
        <Loader />
      </div>
      )}

      {/* Empty state */}
      {Cart && Cart.length === 0 && (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
         
          <h1 className="text-4xl md:text-5xl font-bold text-gray-500 mb-6 tracking-tight">
            Your cart is empty
          </h1>
          <img src={emptycartImg} alt="Empty Cart" className="h-[36vh] md:h-[44vh] opacity-90" />
        </div>
      )}

      {/* Cart content */}
      {Cart && Cart.length > 0 && (
        <>
          {/* Page header — centered */}
          <div className="mb-8">
            <div className="mx-auto w-full max-w-6xl">
              <div className="flex items-center justify-center">
                <h4 className="text-4xl font-bold text-gray-800">My Cart</h4>
              </div>
            </div>
          </div>

          {/* Layout: Items (left) + Summary (right) */}
          <div className="mx-auto grid w/full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Items list */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl bg-white/90 ring-1 ring-gray-200 shadow-sm overflow-hidden">
                {/* Header row */}
                <div className="hidden md:flex items-center px-5 py-3 border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <span className="flex-1">Item</span>
                  <span className="w-32 text-right">Price</span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-100">
                  {Cart.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedId(item._id)}
                      className={[
                        "group flex items-center px-4 md:px-5 py-4 transition",
                        selectedId === item._id
                          ? "bg-yellow-50/60 ring-inset ring-2 ring-yellow-400"
                          : "hover:bg-gray-50"
                      ].join(" ")}
                    >
                      {/* Left: book info */}
                      <div className="flex flex-1 items-center gap-4 md:gap-5">
                        <div className="h-[100px] w-[76px] overflow-hidden rounded-lg ring-1 ring-gray-200 bg-gray-50 flex-shrink-0">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-lg md:text-xl text-gray-900 font-semibold leading-tight line-clamp-1">
                            {item.title}
                          </h2>
                          <p className="text-xs text-gray-500 mt-0.5">by {item.author || "Unknown"}</p>
                          <p className="text-sm text-gray-600 mt-2 hidden lg:block">
                            {item.desc?.slice(0, 110)}
                            {item.desc && item.desc.length > 110 ? "…" : ""}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 hidden md:block lg:hidden">
                            {item.desc?.slice(0, 80)}
                            {item.desc && item.desc.length > 80 ? "…" : ""}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 md:hidden">
                            {item.desc?.slice(0, 100)}
                            {item.desc && item.desc.length > 100 ? "…" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Right: price + delete */}
                      <div className="w-32 flex flex-col items-end justify-center gap-2">
                        <span className="inline-flex items-center rounded-lg bg-amber-100 px-3 py-1.5 text-lg font-semibold text-gray-900 ring-1 ring-amber-200">
                          Rs.{item.price}
                        </span>
                        <button
                          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 hover:border-red-300 active:scale-[0.98] transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item._id);
                          }}
                          title="Remove from cart"
                        >
                          <AiFillDelete size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-6">
                <div className="rounded-2xl bg-white/95 p-6 shadow-sm ring-1 ring-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">Rs.{Total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-500">Free</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-500">—</span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-gray-900">Rs.{Total}</span>
                    </div>
                  </div>

                  <button
                    onClick={PlaceOrder}
                    className="mt-5 w-full rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-gray-900 shadow-sm ring-1 ring-yellow-300 transition hover:bg-yellow-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  >
                    Place Order
                  </button>

                  <p className="mt-3 text-[11px] text-gray-500 text-center">
                    Cash on Delivery. You can review your order in Order History.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;