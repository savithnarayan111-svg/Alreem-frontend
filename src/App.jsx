import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import Dashboard from "./Pages/Dashboard";
import Branches from "./Pages/Branches";
import Plans from "./Pages/Plans";
import Members from "./Pages/member/Members";
import Settings from "./Pages/Settings";
import Products from "./Pages/products/Products";
import Sales from "./Pages/Sales";
// import Invoice from "./Pages/Invoice";
import Staffs from "./Pages/Staffs/Staffs";
import Transactions from "./Pages/Transactions";
import Enquiry from "./Pages/Enquiry";
import Transaction from "./Pages/Transaction";
import Profit_loss from "./Pages/Profit_loss";
// import Login from "./Pages/Login";

const router = createBrowserRouter([
  // {
  //   path: "/login",
  //   element: <Login />,
  // },

  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "members", element: <Members /> },
      { path: "branches", element: <Branches /> },
      { path: "plans", element: <Plans /> },
      { path: "products", element: <Products /> },
      { path: "settings", element: <Settings /> },
      { path: "sales", element: <Sales /> },
      // { path: "invoice", element: <Invoice /> },
      { path: "staffs", element: <Staffs /> },
      { path: "transactions", element: <Transactions /> },
      { path: "enquiry", element: <Enquiry /> },
      { path: "/transaction", element: <Transaction /> },
      { path: "/profit_loss", element: <Profit_loss /> },


    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;