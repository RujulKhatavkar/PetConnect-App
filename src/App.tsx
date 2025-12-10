// src/App.tsx

import React, { useEffect, useState } from "react";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { Navigation } from "./components/Navigation";
import { PetBrowsePage } from "./components/PetBrowsePage";
import { FavoritesPage } from "./components/FavoritesPage";
import { ApplicationPage } from "./components/ApplicationPage";
import { ShelterDashboard } from "./components/ShelterDashboard";
import { AddPetPage } from "./components/AddPetPage";
import { PetDetailPage } from "./components/PetDetailPage";

import type { Pet, Application } from "./types";

export const API_BASE =
  (import.meta as any).env.VITE_API_BASE_URL ||
  "https://petconnect-app-production.up.railway.app";

console.log("API_BASE:", API_BASE);

type UserRole = "adopter" | "shelter";
type UserType = UserRole | null;

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  type: UserRole;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [pets, setPets] = useState<Pet[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const userType: UserType = currentUser?.type ?? null;

  // -----------------------------
  // Helpers to call backend
  // -----------------------------

  async function loadPets() {
    try {
      const res = await fetch(`${API_BASE}/api/pets`);
      if (!res.ok) throw new Error("Failed to load pets");
      const data: Pet[] = await res.json();
      setPets(data);
    } catch (err) {
      console.error("loadPets error", err);
    }
  }

  async function loadFavorites(tok: string) {
    try {
      const res = await fetch(`${API_BASE}/api/favorites`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) throw new Error("Failed to load favorites");
      const favPets: Pet[] = await res.json();
      setFavoriteIds(favPets.map((p) => p.id));
    } catch (err) {
      console.error("loadFavorites error", err);
    }
  }

  async function loadApplications(tok: string) {
    try {
      const res = await fetch(`${API_BASE}/api/applications`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) throw new Error("Failed to load applications");
      const data: Application[] = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("loadApplications error", err);
    }
  }

  async function bootstrapWithToken(tok: string) {
    try {
      const meRes = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!meRes.ok) throw new Error("auth/me failed");
      const { user } = await meRes.json();
      setCurrentUser(user);
      setToken(tok);

      await Promise.all([loadPets(), loadFavorites(tok), loadApplications(tok)]);

      setCurrentPage(user.type === "shelter" ? "dashboard" : "browse");
    } catch (err) {
      console.error("bootstrapWithToken error", err);
      localStorage.removeItem("token");
      setCurrentUser(null);
      setToken(null);
      await loadPets();
      setCurrentPage("home");
    }
  }

  // -----------------------------
  // Initial load
  // -----------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      bootstrapWithToken(storedToken);
    } else {
      loadPets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // Auth handlers
  // -----------------------------

  const handleLogin = (user: CurrentUser, jwt: string) => {
    localStorage.setItem("token", jwt);
    setCurrentUser(user);
    setToken(jwt);

    loadPets();
    loadFavorites(jwt);
    loadApplications(jwt);

    setCurrentPage(user.type === "shelter" ? "dashboard" : "browse");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setToken(null);
    setFavoriteIds([]);
    setApplications([]);
    setSelectedPet(null);
    setCurrentPage("home");
  };

  // -----------------------------
  // Pet / favorites
  // -----------------------------

  const handleAddPet = async (
    petData: Omit<Pet, "id" | "shelterId" | "shelter">
  ) => {
    if (!token || !currentUser || currentUser.type !== "shelter") {
      setCurrentPage("login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(petData),
      });
      if (!res.ok) throw new Error("Failed to create pet");
      const created: Pet = await res.json();
      setPets((prev) => [...prev, created]);
      setCurrentPage("dashboard");
    } catch (err) {
      console.error("handleAddPet error", err);
    }
  };

  const handleToggleFavorite = async (petId: number) => {
    if (!token || !currentUser) {
      setCurrentPage("login");
      return;
    }

    const isFav = favoriteIds.includes(petId);
    try {
      if (isFav) {
        const res = await fetch(`${API_BASE}/api/favorites/${petId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to remove favorite");
      } else {
        const res = await fetch(`${API_BASE}/api/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ petId }),
        });
        if (!res.ok) throw new Error("Failed to add favorite");
      }
      await loadFavorites(token);
    } catch (err) {
      console.error("handleToggleFavorite error", err);
    }
  };

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentPage("detail"); // 👉 Browse → Details
  };

  const handleApplyForPet = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentPage("application-form"); // 👉 Details → Application form
  };

  // -----------------------------
  // Applications
  // -----------------------------

  const handleSubmitApplication = async (
    appData: Omit<Application, "id" | "submittedDate" | "status">
  ) => {
    if (!currentUser || currentUser.type !== "adopter") {
      setCurrentPage("login");
      return;
    }

    if (!selectedPet) {
      console.error("No pet selected for application");
      alert("Please select a pet before submitting an application.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...appData,
          petId: selectedPet.id,
          shelterId: selectedPet.shelterId ?? null,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to submit application");
      }

      const created: Application = await res.json();

      setApplications((prev) => [created, ...prev]);

      setCurrentPage("applications");
    } catch (err: any) {
      console.error("Submit application failed", err);
      alert(
        err?.message ||
          "Something went wrong submitting your application. Please try again."
      );
    }
  };

  const handleUpdateApplicationStatus = async (
    appId: number,
    status: Application["status"]
  ) => {
    if (!token || !currentUser || currentUser.type !== "shelter") {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await loadApplications(token);
    } catch (err) {
      console.error("handleUpdateApplicationStatus error", err);
    }
  };

  // derived lists
  const adopterApplications =
    userType === "adopter" ? applications : [];
  const shelterApplications =
    userType === "shelter" ? applications : [];

  const hiddenPetIdsForAdopter: number[] =
    userType === "adopter"
      ? adopterApplications
          .filter(
            (app) =>
              app.status === "approved" || app.status === "completed"
          )
          .map((app) => app.petId)
      : [];

  // -----------------------------
  // Navigation
  // -----------------------------

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // keep selectedPet when we are in detail or application-form
    if (page !== "detail" && page !== "application-form") {
      setSelectedPet(null);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {currentPage !== "login" && currentPage !== "home" && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          userType={userType}
          favoriteCount={favoriteIds.length}
          applicationCount={adopterApplications.length}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "home" && (
        <HomePage onGetStarted={() => setCurrentPage("login")} />
      )}

      {currentPage === "login" && (
        <LoginPage onLogin={handleLogin} />
      )}

      {currentPage === "browse" && userType === "adopter" && (
        <PetBrowsePage
          pets={pets.filter(
            (pet) => !hiddenPetIdsForAdopter.includes(pet.id)
          )}
          favorites={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onSelectPet={handleSelectPet}
        />
      )}

      {currentPage === "detail" &&
        selectedPet &&
        userType === "adopter" && (
          <PetDetailPage
            pet={selectedPet}
            isFavorite={favoriteIds.includes(selectedPet.id)}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => setCurrentPage("browse")}
            onApply={handleApplyForPet}
          />
        )}

      {currentPage === "application-form" &&
        selectedPet &&
        userType === "adopter" && (
          <ApplicationPage
            selectedPet={selectedPet}
            applications={adopterApplications}
            onBack={() => setCurrentPage("detail")}
            onSubmit={handleSubmitApplication}
          />
        )}

      {currentPage === "favorites" && userType === "adopter" && (
        <FavoritesPage
          pets={pets}
          favorites={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onSelectPet={handleSelectPet}
          onBrowse={() => setCurrentPage("browse")}
        />
      )}

      {currentPage === "applications" &&
        userType === "adopter" && (
          <ApplicationPage
            applications={adopterApplications}
            onBack={() => setCurrentPage("browse")}
            onSubmit={handleSubmitApplication}
          />
        )}

      {currentPage === "dashboard" && userType === "shelter" && (
        <ShelterDashboard
          applications={shelterApplications}
          pets={pets}
          onUpdateStatus={handleUpdateApplicationStatus}
        />
      )}

      {currentPage === "add-pet" && userType === "shelter" && (
        <AddPetPage
          onBack={() => setCurrentPage("dashboard")}
          onSubmit={handleAddPet}
          shelterId={currentUser?.id ?? 0}
          shelterName={currentUser?.name ?? "Shelter"}
        />
      )}
    </div>
  );
}
