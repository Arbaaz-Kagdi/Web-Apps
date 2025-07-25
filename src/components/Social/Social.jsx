import mail from "../../assets/images/8197836_google_mail_social network_message_letter_icon.png";
import gpay from "../../assets/images/icons8-google-pay-48.png";
import s from "./style.module.css";

export function Social() {
  const email = "arbaazkagdi@gmail.com";
  const upiId = "arbaazkagdi@okhdfcbank";
  const upiUrl = `upi://pay?pa=${upiId}&pn=Your%20Name`;

  // Simple device check (not foolproof, but good enough for this use case)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleUPIClick = (e) => {
    if (!isMobile) {
      e.preventDefault(); // stop default link behavior
      alert("UPI payments are supported on mobile devices only.");
    }
  };

  return (
    <div className={isMobile ? s.flexMobileContainer : s.flexContainer}>
      {/* Email Icon */}
      <a href={`mailto:${email}`} title="Drop a mail" className={s.link}>
        <img src={mail} alt="mail" className={s.mail} />
      </a>

      {/* GPay with fallback */}
      <a
        href={upiUrl}
        onClick={handleUPIClick}
        title="Support Us"
        className={s.link}
      >
        <img src={gpay} alt="mail" className={s.gpay} />
      </a>
    </div>
  );
}
