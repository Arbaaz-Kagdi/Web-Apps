import { useEffect, useState } from "react";
import { TVShowAPI } from "./api/tv-show";
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

export function App() {
  const [currentTVShow, setCurrentTVShow] = useState();
  const [recommendationList, setrecommendationList] = useState([]);
  const [currentTrailerId, setCurrentTrailerId] = useState(null);

  async function fetchPopularFunc() {
    try {
      const popularTVShowList = await TVShowAPI.fetchPopulars();
      if (popularTVShowList.length > 0) {
        setCurrentTVShow(popularTVShowList[0]);
      }
    } catch (error) {
      alert("Unable to Get TV Show");
    }
  }

  async function fetchRecommendationFunc(tvShowId) {
    try {
      const recommendationListResp = await TVShowAPI.fetchRecommendations(
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
      const searchResponse = await TVShowAPI.fetchByTitle(title);
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
        const videos = await TVShowAPI.fetchVideos(currentTVShow.id);
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

  useEffect(() => {
    fetchPopularFunc();
  }, []);

  useEffect(() => {
    if (currentTVShow) {
      fetchRecommendationFunc(currentTVShow.id);
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
          <div className="col-4">
            <Logo
              img={logoImg}
              title={"Watowatch"}
              subtitle={"Find a show you may like"}
            ></Logo>
          </div>
          <div className="col-md-12 col-lg-4">
            <SearchBar onSubmit={fetchByTitleFunc}></SearchBar>
          </div>
          <div className="col-md-12 col-lg-4">
            <Social></Social>
          </div>
        </div>
      </div>
      <div className={s.tv_show_detail}>
        {currentTVShow && (
          <TvShowDetail
            tvShow={currentTVShow}
            onWatchTrailer={playTrailer}
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
