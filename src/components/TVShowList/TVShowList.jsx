import { useRef, useEffect } from "react";
import { TVShowListItem } from "../TVShowListItem/TVShowListItem";
import s from "./style.module.css";

export function TVShowList({ tvShowList, onClickItem }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollLeft = 0;
    }
  }, [tvShowList]);

  return (
    <div>
      <div className={s.title}>You'll probably like :</div>
      <div className={s.list} ref={listRef}>
        {tvShowList.map((tvShow) => {
          return (
            <span key={tvShow.id} className={s.tv_show_item}>
              <TVShowListItem
                tvshow={tvShow}
                onClick={onClickItem}
              ></TVShowListItem>
            </span>
          );
        })}
      </div>
    </div>
  );
}
