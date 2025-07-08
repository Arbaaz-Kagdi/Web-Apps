import { StarFill, StarHalf, Star as StarEmpty } from "react-bootstrap-icons";
import s from "./style.module.css";

export function StarRating({ rating }) {
  // Declare star icon array
  const starList = [];
  // Store number of filled stars
  const starFillCount = Math.floor(rating);
  // Store if yes or no there is half star
  const hasHalfStar = rating - parseInt(rating) >= 0.5;
  // Store the number of empty stars
  const emptyStarCount = 5 - starFillCount - (hasHalfStar ? 1 : 0);

  // Push filled star icons
  for (let i = 1; i <= starFillCount; i++) {
    starList.push(<StarFill key={"star-fill" + i}></StarFill>);
  }
  // Push half star icon if needed
  if (hasHalfStar) {
    starList.push(<StarHalf key={"star-half"}></StarHalf>);
  }
  // Push empty half star icons
  for (let i = 1; i <= emptyStarCount; i++) {
    starList.push(<StarEmpty key={"star-empty" + i}></StarEmpty>);
  }

  // Render star icon array
  return <div className={s.starStyle}>{starList}</div>;
}
