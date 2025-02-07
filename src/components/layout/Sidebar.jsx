import React, { useState, useEffect } from "react";
import { Menu, Card } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  AppstoreOutlined,
  TagsOutlined,
  TransactionOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SolutionOutlined,
  ProductOutlined,
  SettingOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Logout from "../modals/Logout";

const items = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: "sub1",
    icon: <AppstoreOutlined />,
    label: "Inventory",
    children: [
      {
        key: "/inventories",
        icon: <ProductOutlined />,
        label: <Link to="/inventories">Inventory</Link>,
      },
      {
        key: "/transactions",
        icon: <TransactionOutlined />,
        label: <Link to="/transactions">Transactions</Link>,
      },
    ],
  },
  {
    key: "sub2",
    icon: <ShopOutlined />,
    label: "Products",
    children: [
      {
        key: "/products",
        icon: <ShoppingCartOutlined />,
        label: <Link to="/products">Products</Link>,
      },
      {
        key: "/categories",
        icon: <TagsOutlined />,
        label: <Link to="/categories">Categories</Link>,
      },
    ],
  },
  {
    key: "sub3",
    icon: <UserOutlined />,
    label: "Management",
    children: [
      {
        key: "/users",
        icon: <TeamOutlined />,
        label: <Link to="/users">Users</Link>,
      },
      {
        key: "/user-roles",
        icon: <UsergroupAddOutlined />,
        label: <Link to="/user-roles">User Roles</Link>,
      },
      {
        key: "/vendors",
        icon: <SolutionOutlined />,
        label: <Link to="/vendors">Vendors</Link>,
      },
    ],
  },
  {
    key: "sub4",
    icon: <LineChartOutlined />,
    label: "Analytics",
    children: [
      {
        key: "/product-analytics",
        icon: <PieChartOutlined />,
        label: <Link to="/product-analytics">Product Analytics</Link>,
      },
    ],
  },
  {
    key: "/configuration",
    icon: <SettingOutlined />,
    label: <Link to="/configuration">Configuration</Link>,
  },
];

const extractTextFromLabel = (label) => {
  if (typeof label === "string") {
    return label;
  }
  if (label.props && label.props.children) {
    return extractTextFromLabel(label.props.children);
  }
  return "";
};

const filterItemsByPermissions = (items, userPermissions) => {
  return items
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          userPermissions.some(
            (permission) =>
              permission.permission === extractTextFromLabel(child.label)
          )
        );
        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }
      } else if (
        userPermissions.some(
          (permission) =>
            permission.permission === extractTextFromLabel(item.label)
        )
      ) {
        return item;
      }
      return null;
    })
    .filter((item) => item !== null);
};
const Sidebar = ({ children, isLoggedIn, setIsLoggedIn, userPermissions }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  // Set open keys based on the current location to open the category (copilot)
  useEffect(() => {
    const path = location.pathname;
    const parentKey = items.find((item) =>
      item.children?.some((child) => child.key === path)
    )?.key;
    if (parentKey) {
      setOpenKeys([parentKey]);
    }
  }, [location.pathname]);

  const filteredItems = filterItemsByPermissions(items, userPermissions);

  return (
    <div style={{ display: "flex", height: "90vh", marginTop: "1em" }}>
      <div
        style={{
          width: 256,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {isLoggedIn ? (
          <>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              openKeys={openKeys}
              onOpenChange={(keys) => setOpenKeys(keys)}
              style={{ flex: 1 }}
              items={filteredItems}
            />
            <Card style={{ height: "10vh" }}>
              <Logout setIsLoggedIn={setIsLoggedIn} />
            </Card>
          </>
        ) : (
          <></>
        )}
      </div>
      <div style={{ flex: 1, padding: "16px" }}>{children}</div>
    </div>
  );
};

export default Sidebar;
