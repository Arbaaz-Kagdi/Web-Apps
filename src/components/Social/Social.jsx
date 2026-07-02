import { Link } from "react-router-dom";
import s from "./style.module.css";

export function Social() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className={isMobile ? s.contactMobileContainer : s.contactContainer}>
      <Link to="/contact" className={s.contactLink}>
        Contact Us
      </Link>
    </div>
  );
}
