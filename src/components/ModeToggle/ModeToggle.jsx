import s from "./style.module.css";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "react-bootstrap-icons";

export function ModeToggle({ mode, onToggle }) {
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

    const options = [
        { value: "tv", label: "TV Shows" },
        { value: "movie", label: "Movies" }
    ];

    const currentOption = options.find(opt => opt.value === mode) || options[0];

    return (
        <div className={s.container} ref={dropdownRef}>
            <div 
                className={s.selector} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={s.currentLabel}>{currentOption.label}</span>
                <ChevronDown color="white" size={14} className={`${s.icon} ${isOpen ? s.iconOpen : ""}`} />
            </div>
            {isOpen && (
                <div className={s.dropdown}>
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`${s.option} ${mode === opt.value ? s.active : ""}`}
                            onClick={() => {
                                onToggle(opt.value);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
