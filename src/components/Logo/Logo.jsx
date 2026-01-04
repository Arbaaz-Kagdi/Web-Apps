import s from "./style.module.css";

export function Logo({ title, subtitle, img, onClick }) {
  return (
    <>
      <div>
        <div
          className={s.flexContainer}
          onClick={onClick}
          style={{ cursor: "pointer" }}
        >
          <img src={img} alt="Logo" className={s.img} />
          <div className={s.title}>{title}</div>
        </div>
        <div className={s.subtitle}>{subtitle}</div>
      </div>
    </>
  );
}
