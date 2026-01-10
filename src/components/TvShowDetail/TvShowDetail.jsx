import s from "./style.module.css";
import { StarRating } from "../StarRating/StarRating.jsx";
import { WatchProviders } from "../WatchProviders/WatchProviders.jsx";
import trailerIcon from "../../assets/images/trailer-icon.png";
import backgroundVideoIcon from "../../assets/images/background-video-icon.png";
import { Tooltip } from "../Tooltip/Tooltip.jsx";

export function TvShowDetail({
  tvShow,
  onWatchTrailer,
  watchProviders,
  backgroundVideoEnabled,
  onBackgroundVideoToggle,
  showNoTrailerTooltip,
  showNoVideoTooltip
}) {
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
        <Tooltip message="No trailer available" show={showNoTrailerTooltip}>
          <button className={s.watch_trailer_btn} onClick={onWatchTrailer}>
            <img src={trailerIcon} alt="Trailer" className={s.button_icon} />
          </button>
        </Tooltip>
        <WatchProviders providers={watchProviders} title={tvShow.name || tvShow.title}></WatchProviders>
        <Tooltip message="No background video available" show={showNoVideoTooltip}>
          <label className={s.background_video_toggle}>
            <input
              type="checkbox"
              checked={backgroundVideoEnabled}
              onChange={(e) => onBackgroundVideoToggle(e.target.checked)}
            />
            <img src={backgroundVideoIcon} alt="Background Video" className={s.toggle_icon} />
          </label>
        </Tooltip>
      </div>
    </div>
  );
}
