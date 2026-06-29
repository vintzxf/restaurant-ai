import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./components/ThemeContext.jsx";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import VendorDashboard from "./pages/VendorDashboard.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import Orders from "./pages/Orders.jsx";
import Favourites from "./pages/Favourites.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Chatbot from "./components/Chatbot.jsx";
import VendorOrders from "./pages/VendorOrders.jsx";
import VendorApply from "./pages/VendorApply.jsx";
import VerifyPhone from "./pages/VerifyPhone.jsx";
import PendingApproval from "./pages/PendingApproval.jsx";
import VendorMenu from "./pages/VendorMenu.jsx";
import VendorSettings from "./pages/VendorSettings.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Chatbot />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Vendor application flow */}
          <Route path="/vendor-apply" element={<VendorApply />} />
          <Route path="/verify-phone" element={<VerifyPhone />} />
          <Route path="/pending-approval" element={<PendingApproval />} />

          {/* Vendor dashboard */}
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/vendor-orders" element={<VendorOrders />} />
          <Route path="/vendor/menu" element={<VendorMenu />} />
          <Route path="/vendor/settings" element={<VendorSettings />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);