/**
 * Root router — defines every route in the app.
 * All routes except Landing are lazy-loaded for code-splitting.
 * Wrapped by <Layout> which provides Header/Footer chrome.
 */
import { lazy } from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./screens/Landing";
const SearchResults = lazy(() => import("./screens/SearchResults"));
const Login = lazy(() => import("./screens/Login"));
const SignUp = lazy(() => import("./screens/SignUp"));
const LostAnimal = lazy(() => import("./screens/LostAnimal"));
const FoundAnimal = lazy(() => import("./screens/FoundAnimal"));
const PostDetail = lazy(() => import("./screens/PostDetail"));
const AnimalDetail = lazy(() => import("./screens/AnimalDetail"));
const ShelterDetail = lazy(() => import("./screens/ShelterDetail"));
const Profile = lazy(() => import("./screens/Profile"));
const PrivacyPolicy = lazy(() => import("./screens/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./screens/legal/TermsOfService"));
const CookiePolicy = lazy(() => import("./screens/legal/CookiePolicy"));
const Settings = lazy(() => import("./screens/Settings"));
const ImageSearch = lazy(() => import("./screens/ImageSearch"));
const NotFound = lazy(() => import("./screens/NotFound"));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="lost" element={<LostAnimal />} />
          <Route path="found" element={<FoundAnimal />} />
          <Route path="image-search" element={<ImageSearch />} />
          <Route path="posts/:id" element={<PostDetail />} />
          <Route path="animals/:id" element={<AnimalDetail />} />
          <Route path="shelters/:id" element={<ShelterDetail />} />
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="cookies" element={<CookiePolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
