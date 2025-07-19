import { Search as SearchIcon } from "react-bootstrap-icons";
import s from "./style.module.css";

export function SearchBar({ onSubmit }) {
  function submit(e) {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      onSubmit(e.target.value);
    }
  }
  return (
    <>
      <SearchIcon size={27} className={s.icon}></SearchIcon>
      <input
        className={s.input}
        type="text"
        placeholder="Search a TV Show you may like"
        onKeyUp={submit}
      ></input>
    </>
  );
}
