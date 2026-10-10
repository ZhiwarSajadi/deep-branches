import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { SITE } from "../site.js";
import { AboutContent } from "./AboutContent.jsx";

/** Modal "About & credits" dialog built on the native <dialog> element (focus trap + Esc come for free). */
export function AboutDialog({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="about"
      aria-labelledby="about-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click on the backdrop
      }}
    >
      <div className="about-body">
        <button type="button" className="about-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <h2 id="about-title">About {SITE.brand}</h2>
        <p className="about-sub">{SITE.tagline}</p>
        <AboutContent />
        <h3>Controls</h3>
        <ul className="about-keys">
          <li>
            <kbd>Space</kbd> play / pause the timeline
          </li>
          <li>
            <kbd>Esc</kbd> close a card or leave first-person view
          </li>
          <li>Drag to orbit, scroll or pinch to zoom, double-click a species for first-person view</li>
          <li>
            In first-person view: <kbd>W</kbd>/<kbd>S</kbd> or the side slider to climb the bar, <kbd>R</kbd> to
            re-centre
          </li>
        </ul>
      </div>
    </dialog>
  );
}
