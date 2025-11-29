import s from "./style.module.css";
import { StarRating } from "../StarRating/StarRating.jsx";

export function TvShowDetail({ tvShow, onWatchTrailer }) {
  const rating = tvShow.vote_average / 2;
  return (
    <div>
      <div className={s.title}>{tvShow.name}</div>
      <div className={s.rating_container}>
        <StarRating rating={rating}></StarRating>
        <span className={s.rating}>{rating.toFixed(1)}/5</span>
      </div>
      <div className={s.overview}>{tvShow.overview}</div>
      <button className={s.watch_trailer_btn} onClick={onWatchTrailer}>
        Watch Trailer
      </button>
    </div>
  );
}
