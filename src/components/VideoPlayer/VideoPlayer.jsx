import s from "./style.module.css";

export function VideoPlayer({ videoId, onClose }) {
    if (!videoId) return null;

    return (
        <div className={s.backdrop} onClick={onClose}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()}>
                <button className={s.close_btn} onClick={onClose}>
                    X
                </button>
                <div className={s.video_container}>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
