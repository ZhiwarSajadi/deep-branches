import { SITE } from "../site.js";
import { AboutContent } from "./AboutContent.jsx";
import { SpeciesList } from "./SpeciesList.jsx";

/** Shown instead of the 3D view when WebGL is unavailable or the 3D scene crashes. */
export function WebGLFallback({ reason }) {
  return (
    <div className="fallback">
      <header>
        <p className="brand-name">{SITE.brand}</p>
        <h1>{SITE.tagline}</h1>
        <p className="fallback-msg" role="status">
          {reason === "error"
            ? "Sorry, the 3D view stopped working. Here is the same information as a plain list."
            : "Your browser or device can’t show the 3D view (WebGL is unavailable). Here is the same information as a plain list."}
        </p>
      </header>
      <main>
        <SpeciesList className="fallback-list" />
        <div className="fallback-about">
          <h2>About</h2>
          <AboutContent />
        </div>
      </main>
    </div>
  );
}
