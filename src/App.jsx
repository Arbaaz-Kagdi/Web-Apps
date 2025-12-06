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

export function App() {
  const [currentTVShow, setCurrentTVShow] = useState();
  const [recommendationList, setrecommendationList] = useState([]);
  const [currentTrailerId, setCurrentTrailerId] = useState(null);
  const [currentMode, setCurrentMode] = useState("tv");
  const [watchProviders, setWatchProviders] = useState(null);

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
        setrecommendationList(recommendationListResp.slice(0, 10));
      }
    } catch (error) {
      alert("Unable to Get Recommended Shows");
    }
  }

  async function fetchByTitleFunc(title) {
    try {
      const api = currentMode === "tv" ? TVShowAPI : MovieAPI;
      const searchResponse = await api.fetchByTitle(title);
      if (searchResponse.length > 0) {
        setCurrentTVShow(searchResponse[0]);
      }
    } catch (error) {
      alert("Unable to Search");
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
          alert("No trailer found for this show");
        }
      } catch (error) {
        alert("Unable to fetch trailer");
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

  useEffect(() => {
    fetchPopularFunc(currentMode);
  }, [currentMode]);

  useEffect(() => {
    if (currentTVShow) {
      fetchRecommendationFunc(currentTVShow.id);
      fetchWatchProvidersFunc(currentTVShow.id);
    }
  }, [currentTVShow]);

  function updateCurrentTVShow(tvShow) {
    setCurrentTVShow(tvShow);
  }

  return (
    <div
      className={s.main_container}
      style={{
        background: currentTVShow
          ? `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("${BACKDROP_BASE_URL}${currentTVShow.backdrop_path}") no-repeat center / cover`
          : "black",
      }}
    >
      <Analytics></Analytics>
      <div className={s.header}>
        <div className="row">
          <div className="col-12 col-lg-2 mb-3 mb-lg-0">
            <Logo
              img={logoImg}
              title={"Watowatch"}
              subtitle={"Find a show you may like"}
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
