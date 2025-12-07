import s from "./style.module.css";

export function Tooltip({ children, message, show }) {
    return (
        <div className={s.tooltip_container}>
            {children}
            {show && message && (
                <div className={s.tooltip}>
                    {message}
                </div>
            )}
        </div>
    );
}
