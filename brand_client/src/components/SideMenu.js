import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/SideMenu.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function SideMenu({ activeLink, admin }) {
  const [isOpen, setIsOpen] = useState(false);
  // const [cookies,removeCookie] = useCookies(['']);

  const [cookies, setCookie, removeCookie] = useCookies(["ma_auth_token"]);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = (e) => {
    console.log("deleting");
    removeCookie("ma_auth_token");
    // window.location.reload();
    // let gg_token=cookies.gg_token
    // console.log(gg_token)
    navigate("/login");
  };

  useEffect(() => {
    let ma_auth_token = cookies.ma_auth_token;
    if (!ma_auth_token) {
      return navigate("/login");
    }
  }, []);

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <nav>
        <ul>
          <li>
            <NavLink
              exact
              to="/dashboard"
              activeClassName="active-link"
              className={activeLink === "home" ? "active-link" : ""}
            >
              Home
            </NavLink>
          </li>

          {admin ? (
            <li>
              <NavLink
                to="/admin/trips"
                activeClassName="active-link"
                className={activeLink === "trips" ? "active-link" : ""}
              >
                Trips
              </NavLink>
            </li>
          ) : null}
          {/* {admin ? (
            <li>
              <NavLink
                to="/admin/activities"
                activeClassName="active-link"
                className={activeLink === "activities" ? "active-link" : ""}
              >
                Activities
              </NavLink>
            </li>
          ) : null} */}
          {admin ? (
            <li>
              <NavLink
                to="/admin/destinations"
                activeClassName="active-link"
                className={activeLink === "destinations" ? "active-link" : ""}
              >
                Destinations
              </NavLink>
            </li>
          ) : null}
          {admin ? (
            <li>
              <NavLink
                to="/admin/bookings"
                activeClassName="active-link"
                className={activeLink === "bookings" ? "active-link" : ""}
              >
                Bookings
              </NavLink>
            </li>
          ) : null}
          {admin ? (
            <li>
              <NavLink
                to="/admin/invoices"
                activeClassName="active-link"
                className={activeLink === "invoices" ? "active-link" : ""}
              >
                Invoices
              </NavLink>
            </li>
          ) : null}
          {/* {admin ? (
            <li>
              <NavLink
                to="/admin/pages"
                activeClassName="active-link"
                className={activeLink === "pages" ? "active-link" : ""}
              >
                Pages
              </NavLink>
            </li>
          ) : null} */}
          {admin ? (
            <li>
              <NavLink
                to="/admin/vouchers"
                activeClassName="active-link"
                className={activeLink === "vouchers" ? "active-link" : ""}
              >
                Vouchers
              </NavLink>
            </li>
          ) : null}
          {admin ? (
            <li>
              <NavLink
                to="/admin/receipts"
                activeClassName="active-link"
                className={activeLink === "receipts" ? "active-link" : ""}
              >
                Receipts
              </NavLink>
            </li>
          ) : null}
          {/* {admin ? (
            <li>
              <NavLink
                to="/admin/blogs"
                activeClassName="active-link"
                className={activeLink === "blogs" ? "active-link" : ""}
              >
                Blogs
              </NavLink>
            </li>
          ) : null} */}
          <li>
            <NavLink
              exact
              to="/my-bookings"
              activeClassName="active-link"
              className={activeLink === "my-bookings" ? "active-link" : ""}
            >
              My Bookings
            </NavLink>
          </li>
          <li className="logoutBtn" onClick={logout}>
            Logout
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SideMenu;
