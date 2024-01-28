import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { TopBar } from "./components/topbar";
import { useAuth } from "./context/auth";
import { PlacesPage } from "./pages/places/placesPage";
import { MyVisitsPage } from "./pages/myVisits/myVisitsPage";
import { SignUpPage } from "./pages/signUp/signUpPage";
import { SignInPage } from "./pages/signIn/signInPage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Layout = () => {
  return (
    <>
      <TopBar></TopBar>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
    </>
  );
};

export const App = () => {
  console.log(import.meta.env.VITE_API_BASE_URL);
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PlacesPage />} />
        <Route path="places/:category" element={<PlacesPage />} />
        {isAuthenticated ? (
          <Route path="my-visits" element={<MyVisitsPage />} />
        ) : (
          <>
            <Route path="register" element={<SignUpPage />} />
            <Route path="login" element={<SignInPage />} />
          </>
        )}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  );
};
