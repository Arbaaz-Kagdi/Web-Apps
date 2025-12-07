import s from "./style.module.css";
import { StarRating } from "../StarRating/StarRating.jsx";
import { WatchProviders } from "../WatchProviders/WatchProviders.jsx";
import trailerIcon from "../../assets/images/trailer-icon.png";
import backgroundVideoIcon from "../../assets/images/background-video-icon.png";

export function TvShowDetail({ tvShow, onWatchTrailer, watchProviders, backgroundVideoEnabled, onBackgroundVideoToggle }) {
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
          <img src={trailerIcon} alt="Trailer" className={s.button_icon} />
        </button>
        <WatchProviders providers={watchProviders}></WatchProviders>
        <label className={s.background_video_toggle}>
          <input
            type="checkbox"
            checked={backgroundVideoEnabled}
            onChange={(e) => onBackgroundVideoToggle(e.target.checked)}
          />
          <img src={backgroundVideoIcon} alt="Background Video" className={s.toggle_icon} />
        </label>
      </div>
    </div>
  );
}
