/**
 * Footer — site-wide footer with navigation links and external resources.
 * Columns: Brand, Product (Report Lost/Found), Project (GitHub),
 * Resources (ASPCA, Petfinder, PawBoost). No props.
 */
import { Link } from "react-router";
import { PawPrint } from "lucide-react";
import { Text } from "@/components/primitives";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link to="/" className={styles.brand}>
              <PawPrint size={20} />
              <span>Humphrey Come Home</span>
            </Link>
            <Text variant="sm" color="muted">
              Reuniting lost pets with their families.
            </Text>
            <Text variant="sm" color="light">contact@humphreycomehome.org</Text>
            <Text variant="sm" color="light">(530) 555-0199</Text>
          </div>

          <div className={styles.col}>
            <Text variant="sm" weight="600">Product</Text>
            <Link to="/lost" className={styles.link}>Report Lost</Link>
            <Link to="/found" className={styles.link}>Report Found</Link>
          </div>

          <div className={styles.col}>
            <Text variant="sm" weight="600">Project</Text>
            <a
              href="https://github.com/ChicoState/humphrey-come-home"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub
            </a>
          </div>

          <div className={styles.col}>
            <Text variant="sm" weight="600">Resources</Text>
            <a href="https://www.aspca.org/pet-care/general-pet-care/lost-pet" target="_blank" rel="noopener noreferrer" className={styles.link}>ASPCA Lost Pet Guide</a>
            <a href="https://www.petfinder.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Petfinder</a>
            <a href="https://www.pawboost.com" target="_blank" rel="noopener noreferrer" className={styles.link}>PawBoost</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <Text variant="sm" color="light">Made with ❤️ in Chico</Text>
          <div className={styles.legal}>
            <Link to="/privacy" className={styles.legalLink}>Privacy</Link>
            <Link to="/terms" className={styles.legalLink}>Terms</Link>
            <Link to="/cookies" className={styles.legalLink}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
