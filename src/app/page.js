"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import LandingPage from "@/components/sections/LandingPage";
import Explore from "@/components/sections/Explore";
import Dashboard from "@/components/sections/Dashboard";
import GlobalModal from "@/components/GlobalModal";
import Wishlist from "@/components/sections/Wishlist";
import MyTickets from "@/components/sections/MyTickets";
import Footer from "@/components/Footer";

// --- TAMBAHAN IMPORT KOMPONEN BARU ---
import Certificates from "@/components/sections/Certificates";
import Profile from "@/components/sections/Profile";
import FAQ from "@/components/sections/FAQ";
// -------------------------------------

export default function Page() {
  const [currentPage, setCurrentPage] = useState("home");
  const [role, setRole] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("tech_role");
    if (savedRole) setRole(savedRole);

    // Request permission notifikasi saat pertama kali buka
    if (
      typeof window !== "undefined" &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }
  }, []);

  const loginAs = (userRole) => {
    const normalizedRole = userRole.toLowerCase();
    localStorage.setItem("tech_role", normalizedRole);
    setRole(normalizedRole);
    setIsAuthOpen(false);

    if (normalizedRole === "eo") {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("explore"); // User biasa langsung diarahkan ke Explore
    }
  };

  const logout = () => {
    localStorage.removeItem("tech_role");
    setRole(null);
    setCurrentPage("home");
  };

  return (
    <>
      <Navbar
        role={role}
        navigateTo={setCurrentPage}
        logout={logout}
        activePage={currentPage}
        openAuth={() => setIsAuthOpen(true)}
      />

      <main className="page-fade">
        {currentPage === "home" && (
          <LandingPage
            navigateTo={setCurrentPage}
            openAuth={() => setIsAuthOpen(true)}
            onOpenModal={setSelectedEvent}
          />
        )}

        {currentPage === "explore" && (
          <Explore onOpenModal={setSelectedEvent} />
        )}

        {currentPage === "dashboard" && (
          <Dashboard navigateTo={setCurrentPage} />
        )}

        {currentPage === "wishlist" && (
          <Wishlist
            onOpenModal={setSelectedEvent}
            navigateTo={setCurrentPage}
          />
        )}

        {currentPage === "tickets" && (
          <MyTickets onOpenModal={setSelectedEvent} />
        )}

        {/* --- RENDER KOMPONEN BARU --- */}
        {currentPage === "certificates" && <Certificates />}
        {currentPage === "profile" && <Profile />}
        {currentPage === "faq" && <FAQ />}
      </main>

      {currentPage !== "dashboard" && <Footer navigateTo={setCurrentPage} />}

      {/* MODAL SISTEM */}
      {isAuthOpen && (
        <AuthModal loginAs={loginAs} onClose={() => setIsAuthOpen(false)} />
      )}

      {selectedEvent && (
        <GlobalModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
