import s from "./style.module.css";

export function BackgroundVideo({ videoId, isUIHidden }) {
    if (!videoId) return null;

    return (
        <div className={s.background_video_container}>
            <iframe
                className={s.video_iframe}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                title="Background Video"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
            />
            <div className={`${s.overlay} ${isUIHidden ? s.overlay_hidden : ""}`}></div>
        </div>
    );
}
