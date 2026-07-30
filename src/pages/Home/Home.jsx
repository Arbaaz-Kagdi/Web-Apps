import { useEffect, useState } from "react";
import { TVShowAPI } from "../../api/tv-show";
import { MovieAPI } from "../../api/movie";
import s from "../../style.module.css";
import { BACKDROP_BASE_URL } from "../../config";
import { TvShowDetail } from "../../components/TvShowDetail/TvShowDetail.jsx";
import { Logo } from "../../components/Logo/Logo.jsx";
// import logoImg from "../../assets/images/icons8-tv-60.png";
import logoGif from "../../assets/images/home-logo.gif";
import { TVShowList } from "../../components/TVShowList/TVShowList.jsx";
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";
import { Analytics } from "@vercel/analytics/react";
import { Social } from "../../components/Social/Social.jsx";
import { VideoPlayer } from "../../components/VideoPlayer/VideoPlayer.jsx";
import { ModeToggle } from "../../components/ModeToggle/ModeToggle.jsx";
import { CategoryDropdown } from "../../components/CategoryDropdown/CategoryDropdown.jsx";
import { BackgroundVideo } from "../../components/BackgroundVideo/BackgroundVideo.jsx";

export function Home() {
  const [currentTVShow, setCurrentTVShow] = useState();
  const [recommendationList, setrecommendationList] = useState([]);
  const [currentTrailerId, setCurrentTrailerId] = useState(null);
  const [currentMode, setCurrentMode] = useState("movie");
  const [currentCategory, setCurrentCategory] = useState("All");
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
  const [isUIHidden, setIsUIHidden] = useState(false);

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
          setCurrentCategory("All");
        }
        // Fade back in
        setTimeout(() => setIsTransitioning(false), 250);
      }, 250);
    } catch (error) {
      alert("Unable to Search");
      setIsTransitioning(false);
    }
  }

  const mapCategoryToQuery = (category, mode) => {
    if (category === "All") return "";
    
    const genreMap = {
        // TV Genres
        "Action & Adventure": 10759,
        "Animation": 16,
        "Comedy": 35,
        "Crime": 80,
        "Documentary": 99,
        "Drama": 18,
        "Family": 10751,
        "Kids": 10762,
        "Mystery": 9648,
        "News": 10763,
        "Reality": 10764,
        "Sci-Fi & Fantasy": 10765,
        "Soap": 10766,
        "Talk": 10767,
        "War & Politics": 10768,
        
        // Movie Genres
        "Action": 28,
        "Adventure": 12,
        "Fantasy": 14,
        "History": 36,
        "Horror": 27,
        "Music": 10402,
        "Romance": 10749,
        "Science Fiction": 878,
        "TV Movie": 10770,
        "Thriller": 53,
        "War": 10752,
        "Western": 37
    };

    let query = "";
    if (genreMap[category]) {
        query += `&with_genres=${genreMap[category]}`;
    }
    return query;
  };

  async function fetchByCategoryFunc(category) {
    setCurrentCategory(category);
    if (category === "All") {
      fetchPopularFunc(currentMode);
      return;
    }
    
    try {
      setIsTransitioning(true);
      setTimeout(async () => {
        const api = currentMode === "tv" ? TVShowAPI : MovieAPI;
        const query = mapCategoryToQuery(category, currentMode);
        const list = await api.fetchByCategory(query);
        if (list && list.length > 0) {
          setCurrentTVShow(list[0]);
        }
        setTimeout(() => setIsTransitioning(false), 250);
      }, 250);
    } catch (error) {
      alert("Unable to Get Content for Category");
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
    let timeout;
    const handleMouseMove = () => {
      if (backgroundVideoEnabled) {
        setIsUIHidden(false);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsUIHidden(true);
        }, 3000);
      }
    };

    if (backgroundVideoEnabled) {
      window.addEventListener("mousemove", handleMouseMove);
      timeout = setTimeout(() => setIsUIHidden(true), 3000);
    } else {
      setIsUIHidden(false);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [backgroundVideoEnabled]);

  useEffect(() => {
    setCurrentCategory("All");
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
      setCurrentCategory("All");
      // Fade back in
      setTimeout(() => setIsTransitioning(false), 250);
    }, 250);
  }

  function resetToHome() {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCategory("All");
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
        <BackgroundVideo videoId={backgroundVideoId} isUIHidden={isUIHidden} />
      )}
      <div
        className={`${s.transition_overlay} ${isTransitioning ? s.visible : ""
          }`}
      ></div>
      <div className={`${s.ui_container} ${isUIHidden ? s.ui_hidden : ""}`}>
        <div className={s.header}>
          <div className="row">
            <div className="col-12 col-lg-2 mb-3 mb-lg-0">
              <Logo
                img={logoGif}
                title={"Watowatch"}
                onClick={resetToHome}
              ></Logo>
            </div>
            <div className="col-12 col-lg-8 d-flex flex-column justify-content-center align-items-center gap-3">
              <SearchBar onSubmit={fetchByTitleFunc} mode={currentMode} onSuggestionSelect={updateCurrentTVShow}></SearchBar>
              <div className="d-flex flex-row flex-wrap justify-content-center align-items-center gap-3 w-100 position-relative" style={{ zIndex: 100 }}>
                <ModeToggle mode={currentMode} onToggle={setCurrentMode} />
                <CategoryDropdown mode={currentMode} currentCategory={currentCategory} onCategorySelect={fetchByCategoryFunc} />
              </div>
            </div>
            <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center justify-content-lg-end mt-3 mt-lg-0">
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
