import { CLADES, SPECIES } from "../data/species.js";
import { formatRange } from "../lib/time.js";

const CHRONOLOGICAL = SPECIES.slice().sort((a, b) => b.start - a.start);

/**
 * Plain-HTML version of everything in the 3D view. Used as
 *  - a visually hidden (screen-reader) alternative next to the canvas, and
 *  - the visible fallback when WebGL is not available.
 */
export function SpeciesList({ className }) {
  return (
    <ol className={className}>
      {CHRONOLOGICAL.map((s) => (
        <li key={s.id}>
          <h3>
            <i>
              {s.genus} {s.sp}
            </i>
          </h3>
          <p>
            {CLADES[s.clade].label} · {formatRange(s)} · {s.place}
            {s.dashed ? " · Ancestry debated" : ""}
          </p>
          <p>{s.note}</p>
          {s.src.length > 0 && (
            <ul>
              {s.src.map(([label, url]) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
