// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManageUser from "./pages/ManageUser";
import ManageMenu from "./pages/ManageMenu";
import ManagePromo from "./pages/ManagePromo";
import ManageReview from "./pages/ManageReview";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./middleware/AuthProvider";
import LogsPage from "./pages/LogsPage";
import ManageTransactions from "./pages/ManageTransactions";
import ManageCustomers from "./pages/ManageCustomers";
import ManageStocks from "./pages/ManageStocks";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ManageUser"
            element={
              <ProtectedRoute>
                <ManageUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ManageCustomers"
            element={
              <ProtectedRoute>
                <ManageCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ManageMenu"
            element={
              <ProtectedRoute>
                <ManageMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ManageStocks"
            element={
              <ProtectedRoute>
                <ManageStocks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ManagePromo"
            element={
              <ProtectedRoute>
                <ManagePromo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ManageReview"
            element={
              <ProtectedRoute>
                <ManageReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ManageTransactions"
            element={
              <ProtectedRoute>
                <ManageTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Logs"
            element={
              <ProtectedRoute>
                <LogsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
