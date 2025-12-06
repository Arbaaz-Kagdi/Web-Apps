import { Search as SearchIcon } from "react-bootstrap-icons";
import s from "./style.module.css";
import { useState } from "react";

export function SearchBar({ onSubmit, mode = "tv" }) {
  const [value, setValue] = useState("");
  function submit(e) {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      onSubmit(e.target.value);
      setValue("");
    }
  }

  function handleChange(e) {
    setValue(e.target.value);
  }

  const placeholder = mode === "tv" ? "Search TV Show" : "Search Movie";

  return (
    <div className={s.container}>
      <SearchIcon size={27} className={s.icon}></SearchIcon>
      <input
        className={s.input}
        type="text"
        placeholder={placeholder}
        onKeyUp={submit}
        value={value}
        onChange={handleChange}
      ></input>
    </div>
  );
}
