import { useEffect, useRef } from "react";
import s from "./style.module.css";

export function BackgroundVideo({ videoId, isUIHidden }) {
    const iframeRef = useRef(null);

    useEffect(() => {
        // Repeatedly attempt to turn off captions as the video loads
        const interval = setInterval(() => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({
                        event: "command",
                        func: "unloadModule",
                        args: ["captions"]
                    }),
                    "*"
                );
                iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({
                        event: "command",
                        func: "unloadModule",
                        args: ["cc"]
                    }),
                    "*"
                );
            }
        }, 500);

        // Clear interval after 5 seconds to prevent it running indefinitely
        setTimeout(() => clearInterval(interval), 5000);

        return () => clearInterval(interval);
    }, [videoId]);

    if (!videoId) return null;

    return (
        <div className={s.background_video_container}>
            <iframe
                ref={iframeRef}
                className={s.video_iframe}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&cc_load_policy=3`}
                title="Background Video"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
            />
            <div className={`${s.overlay} ${isUIHidden ? s.overlay_hidden : ""}`}></div>
        </div>
    );
}
