import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AdminLogin from "./AdminLogin.tsx";
import AdminDashboard from "./AdminDashboard.tsx";
import "./index.css";

function resolvePage() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/admin/login") return <AdminLogin />;
  if (pathname === "/admin/dashboard") return <AdminDashboard />;
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {resolvePage()}
  </StrictMode>
);
