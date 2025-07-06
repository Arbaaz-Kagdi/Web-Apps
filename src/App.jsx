import { TVShowAPI } from "./api/tv-show"
import s from "./style.module.css"
TVShowAPI.fetchPopulars();
export function App() {
    return <div className={s.main_container}>
      <div className={s.header}>
        <div className="row">
          <div className="col-4">
            <div>LOGO</div>
            <div>Subtitle</div>
          </div>
          <div className="col-md-12 col-lg-4">
            <input style={{ width: "100%" }} type="text" />
          </div>
        </div>
      </div>
      <div className={s.tv_show_detail}>Tv show detail</div>
      <div className={s.recommended_tv_shows}>Recommended tv shows</div>
    </div>
  }