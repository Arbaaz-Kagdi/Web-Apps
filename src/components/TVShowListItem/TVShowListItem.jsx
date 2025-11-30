import { SMALL_IMG_COVER_BASE_URL } from "../../config";
import s from "./style.module.css";

const max_title_char = 20;

export function TVShowListItem({ tvshow, onClick }) {
  const onItemClick = () => {
    onClick(tvshow);
  };

  return (
    <div className={s.container} onClick={onItemClick}>
      <img
        src={SMALL_IMG_COVER_BASE_URL + tvshow.backdrop_path}
        alt={tvshow.name || tvshow.title}
        className={s.img}
      />
      <div className={s.title}>
        {(tvshow.name || tvshow.title).length > max_title_char
          ? (tvshow.name || tvshow.title).slice(0, max_title_char) + "..."
          : (tvshow.name || tvshow.title)}
      </div>
    </div>
  );
}
