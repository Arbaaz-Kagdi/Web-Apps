import { Search as SearchIcon } from "react-bootstrap-icons";
import s from "./style.module.css";
import { useState, useEffect, useRef } from "react";
import { TVShowAPI } from "../../api/tv-show";
import { MovieAPI } from "../../api/movie";

export function SearchBar({ onSubmit, mode = "tv", onSuggestionSelect }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function submit(e) {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      onSubmit(e.target.value);
      setValue("");
      setIsDropdownVisible(false);
    }
  }

  function handleChange(e) {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (inputValue.trim() === "") {
      setSuggestions([]);
      setIsDropdownVisible(false);
      return;
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const api = mode === "tv" ? TVShowAPI : MovieAPI;
        const results = await api.fetchByTitle(inputValue);
        if (results && results.length > 0) {
          // Filter out items without a backdrop or poster if needed, then take top 5
          setSuggestions(results.slice(0, 5));
          setIsDropdownVisible(true);
        } else {
          setSuggestions([]);
          setIsDropdownVisible(false);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      }
    }, 300); // 300ms debounce
  }

  function handleSuggestionClick(suggestion) {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      // Fallback if onSuggestionSelect isn't provided
      onSubmit(suggestion.name || suggestion.title);
    }
    setValue("");
    setIsDropdownVisible(false);
  }

  const placeholder = mode === "tv" ? "Search TV Show" : "Search Movie";

  return (
    <div className={s.wrapper} ref={dropdownRef}>
      <div className={s.container}>
        <SearchIcon size={18} className={s.icon}></SearchIcon>
        <input
          className={s.input}
          type="text"
          placeholder={placeholder}
          onKeyUp={submit}
          value={value}
          onChange={handleChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsDropdownVisible(true);
          }}
        ></input>
      </div>
      {isDropdownVisible && suggestions.length > 0 && (
        <div className={s.dropdown}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={s.dropdownItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name || suggestion.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
