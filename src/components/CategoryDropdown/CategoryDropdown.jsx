import s from "./style.module.css";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "react-bootstrap-icons";

export function CategoryDropdown({ mode, currentCategory, onCategorySelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const tvCategories = [
        "All",
        "Action & Adventure", "Drama", "Reality",
        "Animation", "Family", "Sci-Fi & Fantasy",
        "Comedy", "Kids", "Soap",
        "Crime", "Mystery", "Talk",
        "Documentary", "News", "War & Politics",
        "Western"
    ];

    const movieCategories = [
        "All",
        "Action", "Drama", "Mystery",
        "Adventure", "Family", "Romance",
        "Animation", "Fantasy", "Science Fiction",
        "Comedy", "History", "TV Movie",
        "Crime", "Horror", "Thriller",
        "Documentary", "Music", "War",
        "Western"
    ];

    const currentCategories = mode === "tv" ? tvCategories : movieCategories;

    return (
        <div className={s.container} ref={dropdownRef}>
            <div 
                className={s.selector} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={s.label}>{currentCategory === "All" ? "Genres" : currentCategory}</span>
                <ChevronDown color="white" size={14} className={`${s.icon} ${isOpen ? s.iconOpen : ""}`} />
            </div>
            {isOpen && (
                <div className={s.dropdown}>
                    <div className={s.grid}>
                        {currentCategories.map((cat, index) => (
                            <div
                                key={`${cat}-${index}`}
                                className={`${s.option} ${cat === currentCategory ? s.active : ""}`}
                                onClick={() => {
                                    if (cat) {
                                        if (onCategorySelect) onCategorySelect(cat);
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                {cat}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
