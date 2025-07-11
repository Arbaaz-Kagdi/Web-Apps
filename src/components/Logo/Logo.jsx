import s from "./style.module.css";

export function Logo({ title, subtitle, img }) {
  return (
    <>
      <div className={s.flexContainer}>
        <img  src={img} alt="Logo" className={s.img} />
        <div className={s.title}>{title}</div>
      </div>
      <div className={s.subtitle}>{subtitle}</div>
    </>
  );
}
