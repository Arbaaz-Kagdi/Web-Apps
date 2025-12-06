import s from "./style.module.css";
import { StarRating } from "../StarRating/StarRating.jsx";
import { WatchProviders } from "../WatchProviders/WatchProviders.jsx";

export function TvShowDetail({ tvShow, onWatchTrailer, watchProviders }) {
  const rating = tvShow.vote_average / 2;
  return (
    <div>
      <div className={s.title}>{tvShow.name || tvShow.title}</div>
      <div className={s.rating_container}>
        <StarRating rating={rating}></StarRating>
        <span className={s.rating}>{rating.toFixed(1)}/5</span>
      </div>
      <div className={s.overview}>{tvShow.overview}</div>
      <div className={s.button_container}>
        <button className={s.watch_trailer_btn} onClick={onWatchTrailer}>
          Trailer
        </button>
        <WatchProviders providers={watchProviders}></WatchProviders>
      </div>
    </div>
  );
}
