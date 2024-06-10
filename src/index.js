import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SideNav from "./components/SideNav";
import ManageUser from "./pages/ManageUser";
import ManageMenu from "./pages/ManageMenu";
import ManagePromo from "./pages/ManagePromo";
import ManageReviews from "./pages/ManageReview";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import Root from "./routes/root";
import ErrorPage from "./routes/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./middleware/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />,
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "Dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "ManageUser",
        element: (
          <ProtectedRoute>
            <ManageUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "ManageMenu",
        element: (
          <ProtectedRoute>
            <ManageMenu />
          </ProtectedRoute>
        ),
      },
      {
        path: "ManagePromo",
        element: (
          <ProtectedRoute>
            <ManagePromo />
          </ProtectedRoute>
        ),
      },
      {
        path: "ManageReview",
        element: (
          <ProtectedRoute>
            <ManageReviews />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
