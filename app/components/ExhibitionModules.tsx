import { exhibitions } from "../js/exhibitions";

export default function ExhibitionModules() {
  return (
    <div className="modules-container">
      {exhibitions.map((exhibit) => (
        <a
          key={exhibit.slug}
          href={`../exhibitions/${exhibit.slug}`}
          className="module-box"
        >
          <div className="text">
            <h3>{exhibit.title}</h3>
            <p>{exhibit.description}</p>
          </div>

          <div className="image">
            <img
              src={exhibit.image}
              alt={`${exhibit.title} preview`}
            />
          </div>
        </a>
      ))}
    </div>
  );
}