import s from "./style.module.css";

export function ModeToggle({ mode, onToggle }) {
    return (
        <div className={s.container}>
            <div
                className={`${s.option} ${mode === "tv" ? s.active : ""}`}
                onClick={() => onToggle("tv")}
            >
                TV Shows
            </div>
            <div
                className={`${s.option} ${mode === "movie" ? s.active : ""}`}
                onClick={() => onToggle("movie")}
            >
                Movies
            </div>
        </div>
    );
}
