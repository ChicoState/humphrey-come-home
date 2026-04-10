/**
 * Header — top navigation bar.
 * Renders immediately. Shows inline spinner in profile area while loading.
 */
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Menu, X, PawPrint, LogOut, User, Settings, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/queries/useProfile";
import { HStack, Text } from "@/components/primitives";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import Spinner from "@/components/ui/Spinner";
import styles from "./Header.module.css";

export default function Header() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Close menu on navigation
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleSignOut = async () => {
    closeMenu();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const ready = !authLoading && !(user && profileLoading);
  const displayName = profile?.name || user?.email?.split("@")[0] || "Profile";
  const avatarUrl = profile?.avatar_url;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          <PawPrint size={24} />
          <span className={styles.brandText}>Humphrey Come Home</span>
        </Link>

        <div className={styles.desktopAuth}>
          {!ready ? (
            <Spinner size="sm" />
          ) : user ? (
            <Dropdown
              align="right"
              trigger={
                <button className={styles.profileButton}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className={styles.avatar} />
                  ) : (
                    <span className={styles.avatarFallback}>
                      {displayName[0]?.toUpperCase()}
                    </span>
                  )}
                  <span className={styles.profileName}>{displayName}</span>
                  <MoreHorizontal size={16} className={styles.profileEllipsis} />
                </button>
              }
              items={[
                { label: "Profile", icon: User, onPress: () => navigate("/profile") },
                { label: "Settings", icon: Settings, onPress: () => navigate("/settings") },
                { separator: true },
                { label: "Sign Out", icon: LogOut, danger: true, onPress: handleSignOut },
              ]}
            />
          ) : (
            <Button variant="primary" size="sm" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          )}
        </div>

        <div className={styles.menuButton}>
          <Button variant="ghost" size="sm" icon={Menu} onClick={toggleMenu} aria-label="Open menu" />
        </div>
      </div>

      {menuOpen && (
        <>
          <div className={styles.overlay} onClick={closeMenu} />
          <nav className={styles.mobileNav}>
            <div className={styles.closeRow}>
              <Link to="/" className={styles.brand}>
                <PawPrint size={24} />
                <span className={styles.brandText}>Humphrey Come Home</span>
              </Link>
              <Button variant="ghost" size="sm" icon={X} onClick={closeMenu} aria-label="Close menu" />
            </div>
            <Button variant="ghost" size="lg" block onClick={() => { closeMenu(); navigate("/lost"); }}>
              Report Lost
            </Button>
            <Button variant="ghost" size="lg" block onClick={() => { closeMenu(); navigate("/found"); }}>
              Report Found
            </Button>

            <div className={styles.sidebarSpacer} />

            {!ready ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                <Spinner size="sm" />
              </div>
            ) : user ? (
              <HStack align="center" justify="between" padding={3} style={{ marginBottom: 16 }}>
                <HStack gap={4} align="center" as="button" onClick={() => { closeMenu(); navigate("/profile"); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className={styles.sidebarAvatar} />
                  ) : (
                    <span className={styles.sidebarAvatarFallback}>
                      {displayName[0]?.toUpperCase()}
                    </span>
                  )}
                  <div style={{ minWidth: 0, lineHeight: 1.3 }}>
                    <Text variant="body" weight="700" style={{ lineHeight: 1.2 }}>{displayName}</Text>
                    <Text variant="sm" color="muted" style={{ lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</Text>
                  </div>
                </HStack>
                <Dropdown
                  align="right"
                  position="top"
                  trigger={
                    <Button variant="ghost" size="md" icon={MoreHorizontal} aria-label="Account menu" />
                  }
                  items={[
                    { label: "Profile", icon: User, onPress: () => { closeMenu(); navigate("/profile"); } },
                    { label: "Settings", icon: Settings, onPress: () => { closeMenu(); navigate("/settings"); } },
                    { separator: true },
                    { label: "Sign Out", icon: LogOut, danger: true, onPress: handleSignOut },
                  ]}
                />
              </HStack>
            ) : (
              <Button variant="primary" size="lg" block onClick={() => navigate("/login")} style={{ marginBottom: 24 }}>
                Sign In
              </Button>
            )}
          </nav>
        </>
      )}
    </header>
  );
}
