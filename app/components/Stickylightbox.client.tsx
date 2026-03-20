import { useState, useEffect } from "react";
import { getBasePath } from "../js/getBasePath";

interface StickyLightboxProps {
  backgroundSrc?: string;
  lightboxSrc: string;
  alt: string;
  caption?: string;
  lightboxSrc2?: string;
  alt2?: string;
  caption2?: string;
  lightboxSrc3?: string;
  alt3?: string;
  caption3?: string;
  lightboxSrc4?: string;
  alt4?: string;
  caption4?: string;
  heading?: string;
  body?: string;
  listItem1?: string;
  boldPrefix1?: string;
  listItem2?: string;
  boldPrefix2?: string;
  listItem3?: string;
  boldPrefix3?: string;
  listItem4?: string;
  boldPrefix4?: string;
  textPosition?: "left" | "right";
  backgroundCaption?: string;
  collage?: boolean;
}

export default function StickyLightbox({
  backgroundSrc,
  lightboxSrc,
  alt,
  caption,
  lightboxSrc2,
  alt2,
  caption2,
  lightboxSrc3,
  alt3,
  caption3,
  lightboxSrc4,
  alt4,
  caption4,
  heading,
  body,
  listItem1,
  boldPrefix1,
  listItem2,
  boldPrefix2,
  listItem3,
  boldPrefix3,
  listItem4,
  boldPrefix4,
  textPosition = "left",
  backgroundCaption,
  collage = false,
}: StickyLightboxProps) {
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const resolvedBg = backgroundSrc ? `${getBasePath()}${backgroundSrc}` : null;

  const images = [
    { src: `${getBasePath()}${lightboxSrc}`, alt, caption },
    ...(lightboxSrc2 ? [{ src: `${getBasePath()}${lightboxSrc2}`, alt: alt2 ?? "", caption: caption2 }] : []),
    ...(lightboxSrc3 ? [{ src: `${getBasePath()}${lightboxSrc3}`, alt: alt3 ?? "", caption: caption3 }] : []),
    ...(lightboxSrc4 ? [{ src: `${getBasePath()}${lightboxSrc4}`, alt: alt4 ?? "", caption: caption4 }] : []),
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSrc(null);
    };
    if (openSrc) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [openSrc]);

  useEffect(() => {
    const el = document.querySelector(".sticky-lightbox-anchor");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky-lightbox-annotation">
      <div
        className={`photo-container${visible ? " position-fixed" : ""}`}
        style={!resolvedBg ? { background: "#fff" } : undefined}
      >
        {resolvedBg && <img src={resolvedBg} alt="" className="anno-photo" />}
        {backgroundCaption && (
          <div className="sticky-lightbox-bg-caption">{backgroundCaption}</div>
        )}
      </div>

      <div className={`sticky-lightbox-anchor sticky-lightbox-inner sticky-lightbox-${textPosition}`}>
        {/* Text on the left */}
        <div className="sticky-lightbox-text-column">
          <div className="sticky-lightbox-text">
            {heading && <h2>{heading}</h2>}
            {body && <p>{body}</p>}
            {(listItem1 || listItem2 || listItem3 || listItem4) && (
              <ul>
                {listItem1 && <li>{boldPrefix1 && <strong>{boldPrefix1} </strong>}{listItem1}</li>}
                {listItem2 && <li>{boldPrefix2 && <strong>{boldPrefix2} </strong>}{listItem2}</li>}
                {listItem3 && <li>{boldPrefix3 && <strong>{boldPrefix3} </strong>}{listItem3}</li>}
                {listItem4 && <li>{boldPrefix4 && <strong>{boldPrefix4} </strong>}{listItem4}</li>}
              </ul>
            )}
          </div>
        </div>

        {/* Images — collage or grid */}
        {collage ? (
          <div className="sticky-lightbox-collage">
            {images.map((img, i) => (
              <div
                key={i}
                className={`sticky-lightbox-collage-item sticky-lightbox-collage-item-${i}`}
                onClick={() => setOpenSrc(img.src)}
              >
                <img src={img.src} alt={img.alt} />
                <span className="sticky-lightbox-zoom">⤢</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="sticky-lightbox-images-col">
            {images.map((img, i) => (
              <div key={i} className="sticky-lightbox-image-col">
                <div
                  className="sticky-lightbox-image"
                  onClick={() => setOpenSrc(img.src)}
                >
                  <img src={img.src} alt={img.alt} />
                  <span className="sticky-lightbox-zoom">⤢</span>
                </div>
                {img.caption && (
                  <p className="sticky-lightbox-caption">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {openSrc && (
        <div
          className="lightbox-overlay active"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenSrc(null);
          }}
        >
          <button className="lightbox-close" onClick={() => setOpenSrc(null)}>
            ✕
          </button>
          <img src={openSrc} alt="" />
        </div>
      )}
    </div>
  );
}