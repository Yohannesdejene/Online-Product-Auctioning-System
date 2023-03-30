import { useState } from "react";
import "./App.css";
// import Form from "./Components/SignupForm/SignupForm";
// import NavBar from "./Layouts/NavBar/NavBar";
// import Footer from "./Layouts/Footer/Footer";
// import LoginForm from "./Components/LoginForm/LoginForm";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ContactUs from "./Pages/ContactUs/ContactUs";
import About from "./Pages/About/About";
import Auctions from "./Pages/Auctions/Auctions";
import LiveAuction from "./Pages/LiveAuction/LiveAuction";
import Loading from "./Pages/Loading/Loading";
import NotFound from "./Pages/NotFound/NotFound";
import Notification from "./Pages/Notification/Notification";
import Payment from "./Pages/Payment/Payment";
import Profile from "./Pages/Profile/Profile";
import SingleAuction from "./Pages/SingleAuction/SingleAuction";
import CreateAuction from "./Pages/CreateAuction/CreateAuction";
import UpdateAuction from "./Pages/UpdateAuction/UpdateAuction";
import UpdateProfile from "./Pages/UpdateProfile/UpdateProfile";
import DeleteAuction from "./Pages/DeleteAuction/DeleteAuction";
import DeleteUser from "./Pages/DeleteUser/DeleteUser";

import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ####   common routes */}
          <Route path="/auctions" element={<Auctions />} />

          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/singleauction" element={<SingleAuction />} />
          <Route path="/singleauction:id" element={<SingleAuction />} />
          <Route path="/updateProfile" element={<UpdateProfile />} />

          {/* ### seller routes */}
          <Route path="/createAuction" element={<CreateAuction />} />
          <Route path="/updateAuction" element={<UpdateAuction />} />

          {/* ### buyer routes */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/liveauction" element={<LiveAuction />} />

          {/* ### admin routes */}
          <Route path="/deleteauction" element={<DeleteAuction />} />
          <Route path="/deleteuser" element={<DeleteUser />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
