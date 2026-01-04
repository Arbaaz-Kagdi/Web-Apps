import { useEffect, useState } from "react";
import { TVShowAPI } from "./api/tv-show";
import { MovieAPI } from "./api/movie";
import s from "./style.module.css";
import { BACKDROP_BASE_URL } from "./config";
import { TvShowDetail } from "./components/TvShowDetail/TvShowDetail.jsx";
import { Logo } from "./components/Logo/Logo.jsx";
import logoImg from "./assets/images/icons8-tv-60.png";
import { TVShowList } from "./components/TVShowList/TVShowList.jsx";
import { SearchBar } from "./components/SearchBar/SearchBar.jsx";
import { Analytics } from "@vercel/analytics/react";
import { Social } from "./components/Social/Social.jsx";
import { VideoPlayer } from "./components/VideoPlayer/VideoPlayer.jsx";
import { ModeToggle } from "./components/ModeToggle/ModeToggle.jsx";
import { BackgroundVideo } from "./components/BackgroundVideo/BackgroundVideo.jsx";

export function App() {
  const [currentTVShow, setCurrentTVShow] = useState();
  const [recommendationList, setrecommendationList] = useState([]);
  const [currentTrailerId, setCurrentTrailerId] = useState(null);
  const [currentMode, setCurrentMode] = useState("tv");
  const [watchProviders, setWatchProviders] = useState(null);
  const [backgroundVideoId, setBackgroundVideoId] = useState(null);
  const [backgroundVideoEnabled, setBackgroundVideoEnabled] = useState(
    () => {
      const saved = localStorage.getItem("backgroundVideoEnabled");
      return saved !== "false";
    }
  );
  const [showNoTrailerTooltip, setShowNoTrailerTooltip] = useState(false);
  const [showNoVideoTooltip, setShowNoVideoTooltip] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  async function fetchPopularFunc(mode = currentMode) {
    try {
      const api = mode === "tv" ? TVShowAPI : MovieAPI;
      const popularTVShowList = await api.fetchPopulars();
      if (popularTVShowList.length > 0) {
        setCurrentTVShow(popularTVShowList[0]);
      }
    } catch (error) {
      alert("Unable to Get Popular Content");
    }
  }

  async function fetchRecommendationFunc(tvShowId, mode = currentMode) {
    try {
      const api = mode === "tv" ? TVShowAPI : MovieAPI;
      const recommendationListResp = await api.fetchRecommendations(
        tvShowId
      );
      if (recommendationListResp.length > 0) {
        const filteredList = recommendationListResp
          .filter((item) => item.backdrop_path)
          .slice(0, 10);
        setrecommendationList(filteredList);
      }
    } catch (error) {
      alert("Unable to Get Recommended Shows");
    }
  }

  async function fetchByTitleFunc(title) {
    try {
      setIsTransitioning(true);
      // Wait for fade to black
      setTimeout(async () => {
        const api = currentMode === "tv" ? TVShowAPI : MovieAPI;
        const searchResponse = await api.fetchByTitle(title);
        if (searchResponse.length > 0) {
          setCurrentTVShow(searchResponse[0]);
        }
        // Fade back in
        setTimeout(() => setIsTransitioning(false), 250);
      }, 250);
    } catch (error) {
      alert("Unable to Search");
      setIsTransitioning(false);
    }
  }

  async function playTrailer() {
    if (currentTVShow) {
      try {
        const api = currentMode === "tv" ? TVShowAPI : MovieAPI;
        const videos = await api.fetchVideos(currentTVShow.id);
        const trailer = videos.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) {
          setCurrentTrailerId(trailer.key);
        } else {
          // Show tooltip for 2 seconds
          setShowNoTrailerTooltip(true);
          setTimeout(() => setShowNoTrailerTooltip(false), 2000);
        }
      } catch (error) {
        setShowNoTrailerTooltip(true);
        setTimeout(() => setShowNoTrailerTooltip(false), 2000);
      }
    }
  }


  async function fetchWatchProvidersFunc(tvShowId, mode = currentMode) {
    try {
      const api = mode === "tv" ? TVShowAPI : MovieAPI;
      const providers = await api.fetchWatchProviders(tvShowId);
      setWatchProviders(providers);
    } catch (error) {
      console.error("Unable to fetch watch providers:", error);
      setWatchProviders(null);
    }
  }

  async function fetchBackgroundVideo(tvShowId, mode = currentMode) {
    try {
      const api = mode === "tv" ? TVShowAPI : MovieAPI;
      const videos = await api.fetchVideos(tvShowId);
      const trailer = videos.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        setBackgroundVideoId(trailer.key);
      } else {
        setBackgroundVideoId(null);
        setBackgroundVideoEnabled(false);
        localStorage.setItem("backgroundVideoEnabled", "false");
      }
    } catch (error) {
      console.error("Unable to fetch background video:", error);
      setBackgroundVideoId(null);
      setBackgroundVideoEnabled(false);
      localStorage.setItem("backgroundVideoEnabled", "false");
    }
  }

  async function handleBackgroundVideoToggle(enabled) {
    if (enabled) {
      // Check if there's a trailer available
      try {
        const api = currentMode === "tv" ? TVShowAPI : MovieAPI;
        const videos = await api.fetchVideos(currentTVShow.id);
        const trailer = videos.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (trailer) {
          // Trailer found, enable background video
          setBackgroundVideoEnabled(true);
          localStorage.setItem("backgroundVideoEnabled", "true");
          setBackgroundVideoId(trailer.key);
        } else {
          // No trailer found, keep it disabled and show background image
          setBackgroundVideoEnabled(false);
          localStorage.setItem("backgroundVideoEnabled", "false");
          setBackgroundVideoId(null);
          // Show tooltip for 2 seconds
          setShowNoVideoTooltip(true);
          setTimeout(() => setShowNoVideoTooltip(false), 2000);
        }
      } catch (error) {
        console.error("Unable to fetch trailer:", error);
        // On error, disable background video and show background image
        setBackgroundVideoEnabled(false);
        localStorage.setItem("backgroundVideoEnabled", "false");
        setBackgroundVideoId(null);
        // Show tooltip for 2 seconds
        setShowNoVideoTooltip(true);
        setTimeout(() => setShowNoVideoTooltip(false), 2000);
      }
    } else {
      // Disable background video
      setBackgroundVideoEnabled(false);
      localStorage.setItem("backgroundVideoEnabled", "false");
      setBackgroundVideoId(null);
    }
  }

  useEffect(() => {
    fetchPopularFunc(currentMode);
  }, [currentMode]);

  useEffect(() => {
    if (currentTVShow) {
      fetchRecommendationFunc(currentTVShow.id);
      fetchWatchProvidersFunc(currentTVShow.id);
      if (backgroundVideoEnabled) {
        fetchBackgroundVideo(currentTVShow.id);
      } else {
        setBackgroundVideoId(null);
      }
    }
  }, [currentTVShow, backgroundVideoEnabled]);

  function updateCurrentTVShow(tvShow) {
    setIsTransitioning(true);
    // Wait for fade to black
    setTimeout(() => {
      setCurrentTVShow(tvShow);
      // Fade back in
      setTimeout(() => setIsTransitioning(false), 250);
    }, 250);
  }

  function resetToHome() {
    setIsTransitioning(true);
    setTimeout(() => {
      fetchPopularFunc(currentMode);
      setTimeout(() => setIsTransitioning(false), 250);
    }, 250);
  }

  return (
    <div
      className={s.main_container}
      style={{
        background:
          !backgroundVideoEnabled && currentTVShow
            ? `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("${BACKDROP_BASE_URL}${currentTVShow.backdrop_path}") no-repeat center / cover`
            : "transparent",
      }}
    >
      {backgroundVideoEnabled && backgroundVideoId && (
        <BackgroundVideo videoId={backgroundVideoId} />
      )}
      <div
        className={`${s.transition_overlay} ${isTransitioning ? s.visible : ""
          }`}
      ></div>
      <Analytics></Analytics>
      <div className={s.header}>
        <div className="row">
          <div className="col-12 col-lg-2 mb-3 mb-lg-0">
            <Logo
              img={logoImg}
              title={"Watowatch"}
              subtitle={"Find a show you may like"}
              onClick={resetToHome}
            ></Logo>
          </div>
          <div className="col-12 col-lg-8 d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3">
            <ModeToggle mode={currentMode} onToggle={setCurrentMode} />
            <SearchBar onSubmit={fetchByTitleFunc} mode={currentMode}></SearchBar>
          </div>
          <div className="col-12 col-lg-2">
            <Social></Social>
          </div>
        </div>
      </div>
      <div className={s.tv_show_detail}>
        {currentTVShow && (
          <TvShowDetail
            tvShow={currentTVShow}
            onWatchTrailer={playTrailer}
            watchProviders={watchProviders}
            backgroundVideoEnabled={backgroundVideoEnabled}
            onBackgroundVideoToggle={handleBackgroundVideoToggle}
            showNoTrailerTooltip={showNoTrailerTooltip}
            showNoVideoTooltip={showNoVideoTooltip}
          ></TvShowDetail>
        )}
      </div>
      <div className={s.recommended_tv_shows}>
        {currentTVShow && (
          <TVShowList
            onClickItem={updateCurrentTVShow}
            tvShowList={recommendationList}
          ></TVShowList>
        )}
      </div>
      {currentTrailerId && (
        <VideoPlayer
          videoId={currentTrailerId}
          onClose={() => setCurrentTrailerId(null)}
        />
      )}
    </div>
  );
}
