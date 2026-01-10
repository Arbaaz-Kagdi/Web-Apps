import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import s from "./style.module.css";
import platformsIcon from "../../assets/images/platforms-icon.png";

const LOGO_BASE_URL = "https://image.tmdb.org/t/p/original";

export function WatchProviders({ providers, title }) {
    const [isOpen, setIsOpen] = useState(false);

    const getProviderLink = (providerName, showTitle) => {
        const name = providerName.toLowerCase();

        if (name.includes("netflix")) return "https://www.netflix.com";
        if (name.includes("amazon") || name.includes("prime")) return "https://www.amazon.com/gp/video/storefront";
        if (name.includes("disney")) return "https://www.disneyplus.com";
        if (name.includes("hulu")) return "https://www.hulu.com";
        if (name.includes("hbo") || name.includes("max")) return "https://www.max.com";
        if (name.includes("apple")) return "https://tv.apple.com";
        if (name.includes("peacock")) return "https://www.peacocktv.com";
        if (name.includes("paramount")) return "https://www.paramountplus.com";
        if (name.includes("discovery")) return "https://www.discoveryplus.com";
        if (name.includes("youtube")) return "https://www.youtube.com";
        if (name.includes("google")) return "https://play.google.com/store/movies";
        if (name.includes("justwatch")) return "https://www.justwatch.com";
        if (name.includes("fandango") || name.includes("vudu")) return "https://www.vudu.com";
        if (name.includes("plex")) return "https://www.plex.tv";
        if (name.includes("tubi")) return "https://tubitv.com";
        if (name.includes("pluto")) return "https://pluto.tv";
        if (name.includes("crunchyroll")) return "https://www.crunchyroll.com";
        if (name.includes("funimation")) return "https://www.funimation.com";
        if (name.includes("fubo")) return "https://www.fubo.tv";
        if (name.includes("sling")) return "https://www.sling.com";
        if (name.includes("roku")) return "https://therokuchannel.roku.com";
        if (name.includes("britbox")) return "https://www.britbox.com";
        if (name.includes("mubi")) return "https://mubi.com";
        if (name.includes("criterion")) return "https://www.criterionchannel.com";
        if (name.includes("shudder")) return "https://www.shudder.com";
        if (name.includes("curiosity")) return "https://curiositystream.com";

        // Fallback to Google search if homepage is unknown, or could return null to just not link
        return `https://www.google.com/search?q=${providerName}+streaming`;
    };

    const handleProviderClick = (providerName) => {
        const link = getProviderLink(providerName, title);
        window.open(link, "_blank");
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Get US providers (you can change this to user's region)
    const usProviders = providers?.US;
    const watchLink = usProviders?.link;
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
                <img src={platformsIcon} alt="Platforms" className={s.button_icon} />
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
                                        <div
                                            key={provider.provider_id}
                                            className={s.provider_item}
                                            onClick={() => handleProviderClick(provider.provider_name)}
                                            title={`Watch on ${provider.provider_name}`}
                                            role="button"
                                        >
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
                                        <div
                                            key={provider.provider_id}
                                            className={s.provider_item}
                                            onClick={() => handleProviderClick(provider.provider_name)}
                                            title={`Rent on ${provider.provider_name}`}
                                            role="button"
                                        >
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
                                        <div
                                            key={provider.provider_id}
                                            className={s.provider_item}
                                            onClick={() => handleProviderClick(provider.provider_name)}
                                            title={`Buy on ${provider.provider_name}`}
                                            role="button"
                                        >
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
