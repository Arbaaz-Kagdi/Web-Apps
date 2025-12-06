import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import s from "./style.module.css";

const LOGO_BASE_URL = "https://image.tmdb.org/t/p/original";

export function WatchProviders({ providers }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Get US providers (you can change this to user's region)
    const usProviders = providers?.US;
    const streamProviders = usProviders?.flatrate || [];
    const rentProviders = usProviders?.rent || [];
    const buyProviders = usProviders?.buy || [];

    const allProviders = [
        ...streamProviders,
        ...rentProviders,
        ...buyProviders,
    ].filter(
        (provider, index, self) =>
            index === self.findIndex((p) => p.provider_id === provider.provider_id)
    );

    const hasProviders = allProviders.length > 0;

    return (
        <div className={s.container}>
            <button className={s.dropdown_btn} onClick={toggleDropdown}>
                Available Platforms
                {isOpen ? (
                    <ChevronUp className={s.icon} size={16} />
                ) : (
                    <ChevronDown className={s.icon} size={16} />
                )}
            </button>
            {isOpen && (
                <div className={s.dropdown_menu}>
                    {hasProviders ? (
                        <div className={s.providers_list}>
                            {streamProviders.length > 0 && (
                                <div className={s.provider_section}>
                                    <div className={s.section_title}>Stream</div>
                                    {streamProviders.map((provider) => (
                                        <div key={provider.provider_id} className={s.provider_item}>
                                            <img
                                                src={`${LOGO_BASE_URL}${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                className={s.provider_logo}
                                            />
                                            <span className={s.provider_name}>
                                                {provider.provider_name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {rentProviders.length > 0 && (
                                <div className={s.provider_section}>
                                    <div className={s.section_title}>Rent</div>
                                    {rentProviders.map((provider) => (
                                        <div key={provider.provider_id} className={s.provider_item}>
                                            <img
                                                src={`${LOGO_BASE_URL}${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                className={s.provider_logo}
                                            />
                                            <span className={s.provider_name}>
                                                {provider.provider_name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {buyProviders.length > 0 && (
                                <div className={s.provider_section}>
                                    <div className={s.section_title}>Buy</div>
                                    {buyProviders.map((provider) => (
                                        <div key={provider.provider_id} className={s.provider_item}>
                                            <img
                                                src={`${LOGO_BASE_URL}${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                className={s.provider_logo}
                                            />
                                            <span className={s.provider_name}>
                                                {provider.provider_name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={s.no_providers}>No providers available</div>
                    )}
                </div>
            )}
        </div>
    );
}
