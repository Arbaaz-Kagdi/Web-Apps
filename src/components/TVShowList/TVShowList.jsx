import { TVShowListItem } from "../TVShowListItem/TVShowListItem";
import s from "./style.module.css";

export function TVShowList({ tvShowList }) {
  return (
    <div>
      <div className={s.title}>You'll probably like :</div>
      <div className={s.list}>
        {tvShowList.map((tvShow) => {
          return (
            <span key={tvShow.id} className={s.tv_show_item}>
              <TVShowListItem
                tvshow={tvShow}
                onClick={() => console.log("todo")}
              ></TVShowListItem>
            </span>
          );
        })}
      </div>
    </div>
  );
}
