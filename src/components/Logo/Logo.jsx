import s from "./style.module.css";

export function Logo({ title, subtitle, img, onClick, color, subtitleColor }) {
  return (
    <>
      <div>
        <div
          className={s.flexContainer}
          onClick={onClick}
          style={{ cursor: "pointer" }}
        >
          <img src={img} alt="Logo" className={s.img} />
          <div className={s.title} style={{ color: color }}>{title}</div>
        </div>
        <div className={s.subtitle} style={{ color: subtitleColor }}>{subtitle}</div>
      </div>
    </>
  );
}
