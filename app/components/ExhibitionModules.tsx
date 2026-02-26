import React from "react";
import { exhibitions } from "../js/exhibitions";
import { getBasePath } from "../js/getBasePath";

export default function ExhibitionModules() {
  const base = getBasePath();

  return (
    <div className="modules-container">
      {exhibitions.map((exhibit) => (
        <a
          key={exhibit.slug}
          href={`${base}/exhibitions/${exhibit.slug}/`}
          className="module-box"
        >
          {/* TEXT SIDE */}
          <div className="text">
            <h2>{exhibit.title}</h2>
            <p>{exhibit.description}</p>
          </div>

          {/* IMAGE SIDE */}
          <div className="image">
            <img
              src={`${base}${exhibit.image}`}
              alt={exhibit.title}
            />
          </div>
        </a>
      ))}
    </div>
  );
}