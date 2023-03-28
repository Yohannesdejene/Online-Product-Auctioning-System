import { useState } from "react";
import "./Nav.css";
function Nav() {
  return (
    <div>
      <div className="nav">
        <div className="logoImage">
          <img src="air.jpg" alt="images_place" />
        </div>
        <div className="navright">
          <h3 className="signup">
         Signup
          </h3>
          <h3 className="signin">Log in</h3>
        </div>
      </div>
      <hr />
    </div>
  );
}
export default Nav;
