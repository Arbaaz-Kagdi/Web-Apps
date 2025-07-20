import s from "./style.module.css";

export function Logo({ title, subtitle, img }) {
  function toggleHome() {
    window.location.reload();
  }
  return (
    <>
      <div>
        <div className={s.flexContainer} onClick={toggleHome}>
          <img src={img} alt="Logo" className={s.img} />
          <div className={s.title}>{title}</div>
        </div>
        <div className={s.subtitle}>{subtitle}</div>
      </div>
    </>
  );
}
