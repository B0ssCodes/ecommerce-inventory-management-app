import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ValidateRoute from "./components/utility/ValidateRoute";
import AllProducts from "./pages/Products/AllProducts/AllProducts";
import ViewProduct from "./pages/Products/ViewProduct/ViewProduct";
import CreateProduct from "./pages/Products/CreateProduct/CreateProduct";
import EditProduct from "./pages/Products/EditProduct/EditProduct";
import AllUsers from "./pages/Users/AllUsers/AllUsers";
import CreateUser from "./pages/Users/CreateUser/CreateUser";
import EditUser from "./pages/Users/EditUser/EditUser";
import AllVendors from "./pages/Vendors/AllVendors/AllVendors";
import CreateVendor from "./pages/Vendors/CreateVendor/CreateVendor";
import EditVendor from "./pages/Vendors/EditVendor/EditVendor";
import AllCategories from "./pages/Categories/AllCategories/AllCategories";
import CreateCategory from "./pages/Categories/CreateCategory/CreateCategory";
import EditCategory from "./pages/Categories/EditCategory/EditCategory";
import Sidebar from "./components/layout/Sidebar";
import AllTransactions from "./pages/Transactions/AllTransactions/AllTransactions";
import CreateTransaction from "./pages/Transactions/CreateTransaction/CreateTransaction";
import SelectVendor from "./pages/Vendors/SelectVendor/SelectVendor";
import SubmitTransaction from "./pages/Transactions/SubmitTransaction/SubmitTransaction";
import ViewTransaction from "./pages/Transactions/ViewTransaction/ViewTransaction";
import AllUserRoles from "./pages/UserRoles/AllUserRoles/AllUserRoles";
import CreateUserRole from "./pages/UserRoles/CreateUserRole/CreateUserRole";
import EditUserRole from "./pages/UserRoles/EditUserRole/EditUserRole";
import AllInventories from "./pages/Inventory/AllInventories/AllInventories";
import LowInventories from "./pages/Inventory/LowInventories/LowInventories";
import OutInventories from "./pages/Inventory/OutInventories/OutInventories";
import AllProductAnalytics from "./pages/ProductAnalytics/AllProductAnalytics/AllProductAnalytics";
import { decodeToken } from "./components/utility/decodeToken";
import Configuration from "./pages/Configuration/Configuration";
function App({ isDarkMode, toggleTheme }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  let userRoleID = 0;

  const getUserPermissions = async (roleID) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://localhost:7200/api/userRole/get/${roleID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUserPermissions(data.result.permissions);

      const permissions = data.result.permissions.map((p) => p.permission);
      localStorage.setItem("userPermissions", JSON.stringify(permissions));
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    }
  };

  useEffect(() => {
    const minStockNumber = localStorage.getItem("minStockNumber");
    if (!minStockNumber) {
      localStorage.setItem("minStockNumber", 10);
    }

    const statisticsRefreshRate = localStorage.getItem("statisticsRefreshRate");
    if (!statisticsRefreshRate) {
      localStorage.setItem("statisticsRefreshRate", 7);
    }

    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const claims = decodeToken(token);

    if (claims) {
      userRoleID =
        claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      getUserPermissions(userRoleID);
    }
    if (token && tokenExpiry) {
      const currentTime = new Date().getTime();
      if (currentTime > tokenExpiry) {
        // Token has expired, refresh the page to redirect to login
        window.location.reload();
      } else {
        setIsLoggedIn(true);
      }
    }
  }, [localStorage.getItem("token")]);
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
      <Sidebar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userPermissions={userPermissions}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ValidateRoute requiredPermissions={"any"}>
                <Dashboard />
              </ValidateRoute>
            }
          />
          <Route
            path="/configuration"
            element={
              <ValidateRoute requiredPermissions={"any"}>
                <Configuration />
              </ValidateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ValidateRoute requiredPermissions={"Products"}>
                <AllProducts />
              </ValidateRoute>
            }
          />
          <Route
            path="/view-product/:productID"
            element={
              <ValidateRoute requiredPermissions={"Products"}>
                <ViewProduct />
              </ValidateRoute>
            }
          />
          <Route
            path="/create-product"
            element={
              <ValidateRoute requiredPermissions={"Products"}>
                <CreateProduct />
              </ValidateRoute>
            }
          />
          <Route
            path="/edit-product"
            element={
              <ValidateRoute requiredPermissions={"Products"}>
                <EditProduct />
              </ValidateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ValidateRoute requiredPermissions={"Users"}>
                <AllUsers />
              </ValidateRoute>
            }
          />

          <Route
            path="/create-user"
            element={
              <ValidateRoute requiredPermissions={"Users"}>
                <CreateUser />
              </ValidateRoute>
            }
          />
          <Route
            path="/edit-user"
            element={
              <ValidateRoute requiredPermissions={"Users"}>
                <EditUser />
              </ValidateRoute>
            }
          />
          <Route
            path="/user-roles"
            element={
              <ValidateRoute requiredPermissions={"User Roles"}>
                <AllUserRoles />
              </ValidateRoute>
            }
          />
          <Route
            path="/create-user-role"
            element={
              <ValidateRoute requiredPermissions={"User Roles"}>
                <CreateUserRole />
              </ValidateRoute>
            }
          />
          <Route
            path="/edit-user-role"
            element={
              <ValidateRoute requiredPermissions={"User Roles"}>
                <EditUserRole />
              </ValidateRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ValidateRoute requiredPermissions={"Vendors"}>
                <AllVendors />
              </ValidateRoute>
            }
          />
          <Route
            path="/create-vendor"
            element={
              <ValidateRoute requiredPermissions={"Vendors"}>
                <CreateVendor />
              </ValidateRoute>
            }
          />
          <Route
            path="/edit-vendor"
            element={
              <ValidateRoute requiredPermissions={"Vendors"}>
                <EditVendor />
              </ValidateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ValidateRoute requiredPermissions={"Categories"}>
                <AllCategories />
              </ValidateRoute>
            }
          />
          <Route
            path="/create-category"
            element={
              <ValidateRoute requiredPermissions={"Categories"}>
                <CreateCategory />
              </ValidateRoute>
            }
          />
          <Route
            path="/edit-category"
            element={
              <ValidateRoute requiredPermissions={"Categories"}>
                <EditCategory />
              </ValidateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ValidateRoute requiredPermissions={"Transactions"}>
                <AllTransactions />
              </ValidateRoute>
            }
          />
          <Route
            path="/create-transaction"
            element={
              <ValidateRoute requiredPermissions={"Transactions"}>
                <CreateTransaction />
              </ValidateRoute>
            }
          />
          <Route
            path="/select-vendor"
            element={
              <ValidateRoute requiredPermissions={"Transactions"}>
                <SelectVendor />
              </ValidateRoute>
            }
          />
          <Route
            path="/submit-transaction"
            element={
              <ValidateRoute requiredPermissions={"Transactions"}>
                <SubmitTransaction />
              </ValidateRoute>
            }
          />
          <Route
            path="/view-transaction"
            element={
              <ValidateRoute requiredPermissions={"Transactions"}>
                <ViewTransaction
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              </ValidateRoute>
            }
          />
          <Route
            path="/inventories"
            element={
              <ValidateRoute requiredPermissions={"Inventory"}>
                <AllInventories />
              </ValidateRoute>
            }
          />
          <Route
            path="/low-inventories"
            element={
              <ValidateRoute requiredPermissions={"Inventory"}>
                <LowInventories />
              </ValidateRoute>
            }
          />
          <Route
            path="/out-inventories"
            element={
              <ValidateRoute requiredPermissions={"any"}>
                <OutInventories />
              </ValidateRoute>
            }
          />
          <Route
            path="/product-analytics"
            element={
              <ValidateRoute requiredPermissions={"Products"}>
                <AllProductAnalytics />
              </ValidateRoute>
            }
          />
        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;
