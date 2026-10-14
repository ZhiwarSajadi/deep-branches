import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw, X } from "lucide-react";
import { ANC_CHAIN, FP_STATE, ROOT_NODE, fpKids, fpName, fpParent } from "./lib/lineage.js";
import { CLADES, SPECIES, SPECIES_BY_ID } from "./data/species.js";
import { Scene } from "./scene/Scene.jsx";
import { FpHud } from "./components/FpHud.jsx";
import { skullFor } from "@skulls";
import { reconFor } from "@recons";
import { pronunciationFor } from "./data/pronunciations.js";
import { SITE, HOMININ_COUNT } from "./site.js";
import { AboutDialog } from "./components/AboutDialog.jsx";
import { SpeciesList } from "./components/SpeciesList.jsx";
import { formatMa, formatRange } from "./lib/time.js";
const PLAY_DURATION_MS = 16e3;
export function App() {
  let [timeMa, setTimeMa] = useState(8), // Always start at 8 Ma so it plays automatically from the beginning
    [playing, setPlaying] = useState(true), // Automatically play by default upon website opening or refresh
    [selectedId, setSelectedId] = useState(null),
    [hiddenClades, setHiddenClades] = useState(new Set()),
    [autoRotate, setAutoRotate] = useState(true), // Automatically orbit by default upon website opening or refresh
    [aboutOpen, setAboutOpen] = useState(false),
    [fp, setFp] = useState(null),
    [ancestorsOnly, setAncestorsOnly] = useState(false),
    [hideLabels, setHideLabels] = useState(false),
    [expandedMedia, setExpandedMedia] = useState(null),
    [cardMinimized, setCardMinimized] = useState(false),
    expandedMediaRef = useRef(null),
    fpRef = useRef(null),
    rafRef = useRef();
  useEffect(() => {
    if (!playing) return;
    let lastTime = performance.now();
    let frameId;
    const tick = (now) => {
      const dt = Math.min(now - lastTime, 100);
      lastTime = now;
      let atEnd = false;
      setTimeMa((prev) => {
        const next = prev - (8 * dt) / PLAY_DURATION_MS;
        if (next <= 0) {
          atEnd = true;
          return 0;
        }
        return next;
      });
      if (atEnd) {
        setPlaying(false);
        setAutoRotate(false);
        return;
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [playing]);
  useEffect(() => {
    if (timeMa <= 0.001) {
      setPlaying(false);
      setAutoRotate(false);
    }
  }, [timeMa]);
  useEffect(() => {
    FP_STATE.chain = ancestorsOnly ? ANC_CHAIN : null;
  }, [ancestorsOnly]);
  useEffect(() => {
    if (!selectedId) {
      setExpandedMedia(null);
      setCardMinimized(false);
    }
  }, [selectedId]);
  let togglePlay = () => {
      if (timeMa <= 0.05) {
        setTimeMa(8);
        setPlaying(true);
        setAutoRotate(true);
      } else {
        setPlaying((v) => !v);
      }
    },
    togglePlayRef = useRef(),
    setSelectedRef = useRef();
  togglePlayRef.current = togglePlay;
  setSelectedRef.current = setSelectedId;
  fpRef.current = fp;
  expandedMediaRef.current = expandedMedia;
  useEffect(() => {
    let v = (y) => {
      const el = y.target;
      if (el.closest?.("dialog")) return; // the About dialog handles its own keys
      if (el.tagName === "INPUT" && y.code !== "Space") return;
      // Keyboard users who have tabbed onto a button/link: let Space activate it instead of toggling playback.
      if (y.code === "Space" && /^(BUTTON|A)$/.test(el.tagName) && el.matches(":focus-visible")) return;
      if (y.code === "Space") {
        y.preventDefault();
        togglePlayRef.current();
      }
      if (y.code === "Escape") {
        if (expandedMediaRef.current) {
          setExpandedMedia(null);
        } else if (fpRef.current) {
          setFp(null);
        } else {
          setSelectedRef.current(null);
        }
      }
      if (y.code === "KeyL") {
        setHideLabels((h) => !h);
      }
    };
    window.addEventListener("keydown", v);
    return () => window.removeEventListener("keydown", v);
  }, []);
  let selected = selectedId === "root" ? ROOT_NODE : SPECIES.find((v) => v.id === selectedId),
    aliveCount = SPECIES.filter(
      (v) => timeMa <= v.start && timeMa >= v.end && v.id !== "pan" && (!ancestorsOnly || ANC_CHAIN.has(v.id)),
    ).length,
    toggleClade = (v) =>
      setHiddenClades((prev) => {
        const next = new Set(prev);
        if (next.has(v)) {
          next.delete(v);
        } else {
          next.add(v);
        }
        return next;
      }),
    toggleAnc = () => {
      if (!ancestorsOnly && selectedId && !ANC_CHAIN.has(selectedId)) setSelectedId(null);
      setAncestorsOnly(!ancestorsOnly);
    },
    onLegendClick = (v) => {
      ancestorsOnly ? setAncestorsOnly(false) : toggleClade(v);
    },
    selectAndGrow = (targetId) => {
      if (targetId === "root") {
        setSelectedId("root");
        return;
      }
      let target = SPECIES_BY_ID[targetId];
      if (!target) return;
      setSelectedId(targetId);
      if (timeMa > target.start) {
        setTimeMa(Math.max(0, target.end));
      }
    },
    enterFp = (id) => {
      setSelectedId(id);
      setFp(id);
      setPlaying(false);
      let need = [id, ...fpKids(id)]
        .filter((x) => x !== "root")
        .map((x) => SPECIES_BY_ID[x]?.end)
        .filter((e) => typeof e === "number");
      if (need.length) setTimeMa((x) => Math.max(0, Math.min(x, ...need)));
    },
    go = (id) => (fp ? enterFp(id) : selectAndGrow(id)),
    chrono = [ROOT_NODE, ...SPECIES.slice().sort((v1, v2) => v2.start - v1.start)].filter(
      (x) => !ancestorsOnly || ANC_CHAIN.has(x.id),
    ),
    curIdx = selected ? chrono.findIndex((x) => x.id === selected.id) : -1,
    prevSp = curIdx > 0 ? chrono[curIdx - 1] : null,
    nextSp = curIdx >= 0 && curIdx < chrono.length - 1 ? chrono[curIdx + 1] : null,
    anc = selected
      ? ((p) => (p === "root" ? ROOT_NODE : p ? SPECIES_BY_ID[p] : null))(fpParent(selected.id))
      : null,
    descs = selected ? fpKids(selected.id).map((x) => SPECIES_BY_ID[x]) : [],
    accent = selected
      ? (
          CLADES[selected.clade] || {
            color: "#2a2522",
          }
        ).color
      : null;
  return (
    <main className="stage">
      <Canvas
        camera={{
          position: [0, 4.5, 15],
          fov: 38,
        }}
        dpr={[1, 2]}
        role="group"
        aria-label="Interactive 3D chart of hominin species through time. A plain-text list of all species follows."
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Scene
          time={timeMa}
          selected={selectedId}
          setSelected={setSelectedId}
          hidden={hiddenClades}
          follow={playing}
          autoRotate={autoRotate}
          fp={fp}
          onFp={enterFp}
          ancm={ancestorsOnly}
          hideLabels={hideLabels}
          cardMinimized={cardMinimized}
        />
      </Canvas>
      <header className={`head ${selected || fp ? "quiet" : ""} ${fp ? "fp-on" : ""}`}>
        <div className="brand">
          <span className="brand-name">{SITE.brand}</span>
          <span className="brand-sub">{SITE.tagline}</span>
          <button type="button" className="about-btn" onClick={() => setAboutOpen(true)}>
            About &amp; credits
          </button>
        </div>
        <h1>
          We are one branch,
          <br />
          <em>of a much larger tree.</em>
        </h1>
        <p>
          {HOMININ_COUNT} hominin lineages across more than seven million years, each with its sources. Drag to orbit · tap a
          species · double-click to step inside · space to play.
        </p>
      </header>
      {fp && <FpHud fp={fp} onJump={enterFp} />}
      {fp && (
        <div className="fp-hint">
          <strong>First-person view</strong>
          <span>
            {window.matchMedia && window.matchMedia("(pointer:coarse)").matches
              ? "Drag to look · pinch to zoom · side slider climbs the bar · tap a label to jump, an arrow to turn toward it"
              : "Drag to look · scroll to zoom · W/S or the side slider to climb the bar · R to re-center · click a label to jump (arrows turn you toward relatives out of view) · "}
          </span>
          {!(window.matchMedia && window.matchMedia("(pointer:coarse)").matches) && <kbd>Esc</kbd>}
          {!(window.matchMedia && window.matchMedia("(pointer:coarse)").matches) && (
            <span>{" to return"}</span>
          )}
        </div>
      )}
      {selected && (
        <aside
          className={`card ${fp ? "in-fp" : ""} ${cardMinimized ? "minimized" : ""}`}
          style={{
            "--c": accent,
          }}
          key={selected.id}
        >
          <div
            className="card-top"
            onClick={() => cardMinimized && setCardMinimized(false)}
            title={cardMinimized ? "Click to expand details" : undefined}
          >
            <div className="card-nav">
              <button
                type="button"
                className="card-nav-btn"
                disabled={!prevSp}
                onClick={(e) => {
                  e.stopPropagation();
                  prevSp && go(prevSp.id);
                }}
                title={prevSp ? `Earlier: ${fpName(prevSp)}` : "Earliest"}
              >
                ←
              </button>
              <button
                type="button"
                className="card-nav-btn"
                disabled={!nextSp}
                onClick={(e) => {
                  e.stopPropagation();
                  nextSp && go(nextSp.id);
                }}
                title={nextSp ? `Later: ${fpName(nextSp)}` : "Latest"}
              >
                →
              </button>
              <span className="card-clade">
                {selected.id === "root" ? "Common ancestor" : CLADES[selected.clade].label}
              </span>
              {cardMinimized && (
                <span className="card-min-name">
                  <i>{selected.genus} {selected.sp}</i>
                </span>
              )}
            </div>
            <div className="card-top-actions">
              <button
                type="button"
                className="card-min-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardMinimized((m) => !m);
                }}
                aria-label={cardMinimized ? "Maximize details card" : "Minimize details card"}
                title={cardMinimized ? "Maximize card" : "Minimize card"}
              >
                {cardMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button
                type="button"
                className="x"
                onClick={(e) => {
                  e.stopPropagation();
                  setFp(null);
                  setSelectedId(null);
                  setCardMinimized(false);
                }}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {!cardMinimized && (
            <>
              <div className="card-heading">
                <h2>
                  <i>
                    {selected.genus} {selected.sp}
                  </i>
                </h2>
                {(() => {
                  const pron = pronunciationFor(selected.id);
                  if (!pron) return null;
                  return (
                    <div className="card-pron" title={`Pronunciation: ${pron.guide} (${pron.ipa})`}>
                      <span className="pron-guide">{pron.guide}</span>
                      <span className="pron-ipa">{pron.ipa}</span>
                    </div>
                  );
                })()}
                <div className="card-meta">
                  <span className="range">{selected.id === "root" ? "~7.5 Ma (estimated)" : formatRange(selected)}</span>
                  <span className="meta-sep">·</span>
                  <span className="place">{selected.place}</span>
                </div>
              </div>

              {(() => {
                const sk = skullFor(selected.id);
                const rc = reconFor(selected.id);
                if (!sk && !rc) return null;
                return (
                  <div className={`card-media-grid ${rc && sk ? "dual" : "single"}`}>
                    {rc && (
                      <div className="card-media-card clickable">
                        <button
                          type="button"
                          className="media-img-btn"
                          onClick={() => setExpandedMedia("recon")}
                          aria-label={`Enlarge life reconstruction of ${selected.genus} ${selected.sp}`}
                          title="Click to view the enlarged reconstruction"
                        >
                          <span className="media-img-wrap">
                            <img
                              src={rc.url}
                              alt={`${selected.genus} ${selected.sp} life & facial reconstruction`}
                              loading="lazy"
                            />
                            <span className="media-zoom-hint" aria-hidden="true">⤢ Enlarge</span>
                          </span>
                        </button>
                        <div className="media-meta">
                          <span className="media-kind">Reconstruction</span>
                          <a
                            href={rc.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="media-link"
                            title={`${rc.title ? rc.title + " · " : ""}By ${rc.author} (${rc.license})`}
                          >
                            {rc.license} ↗
                          </a>
                        </div>
                      </div>
                    )}
                    {sk && (
                      <div className="card-media-card clickable">
                        <button
                          type="button"
                          className="media-img-btn"
                          onClick={() => setExpandedMedia("fossil")}
                          aria-label={`Enlarge fossil specimen photo of ${selected.genus} ${selected.sp}`}
                          title="Click to view the enlarged fossil specimen"
                        >
                          <span className="media-img-wrap">
                            <img
                              src={typeof sk === "object" ? sk.url : sk}
                              alt={`${selected.genus} ${selected.sp} fossil specimen`}
                              loading="lazy"
                            />
                            <span className="media-zoom-hint" aria-hidden="true">⤢ Enlarge</span>
                          </span>
                        </button>
                        <div className="media-meta">
                          <span className="media-kind">Fossil specimen</span>
                          {typeof sk === "object" && sk.author && (
                            <a
                              href={sk.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="media-link"
                              title={`${sk.specimen ? sk.specimen + " · " : ""}Photo: ${sk.author} (${sk.license})`}
                            >
                              {sk.license} ↗
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <p className="note">{selected.note}</p>

              <div className="card-action-bar">
                <button
                  className={`fp-btn ${fp === selected.id ? "on" : ""}`}
                  onClick={() => (fp === selected.id ? setFp(null) : enterFp(selected.id))}
                  title={
                    fp === selected.id ? "Back to the full tree (Esc)" : "Stand inside this bar and look around"
                  }
                >
                  {fp === selected.id ? "⤺ Third-person view" : "◉ First-person view"}
                </button>
                {selected.dashed && <span className="debate">Ancestry debated</span>}
              </div>

              <div className="card-footer-rows">
                {selected.src && selected.src.length > 0 && (
                  <div className="card-row sources">
                    <span className="row-label">Sources:</span>
                    <div className="row-links">
                      {selected.src.map((x, k) => (
                        <a key={k} href={x[1]} target="_blank" rel="noopener noreferrer" title={x[0]}>
                          {x[0].split(",")[0].replace(" Program", "")} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {(anc || descs.length > 0) && (
                  <div className="card-row ancestry">
                    {anc && (
                      <div className="anc-group">
                        <span className="row-label">Ancestor:</span>
                        <div className="anc-pills">
                          <button className="ancestry-btn" onClick={() => go(anc.id)}>
                            {fpName(anc)}
                          </button>
                        </div>
                      </div>
                    )}
                    {descs.length > 0 && (
                      <div className="anc-group">
                        <span className="row-label">{descs.length > 1 ? "Descendants:" : "Descendant:"}</span>
                        <div className="anc-pills">
                          {descs.map((d) => (
                            <button key={d.id} className="ancestry-btn" onClick={() => go(d.id)}>
                              {fpName(d)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      )}
      {selected && expandedMedia && (
        <aside
          className="card-media-expanded"
          style={{
            "--c": accent,
          }}
          role="dialog"
          aria-label="Enlarged specimen and reconstruction view"
        >
          <div className="expanded-top">
            <div className="expanded-switcher">
              {reconFor(selected.id) && (
                <button
                  type="button"
                  className={`expanded-tab ${expandedMedia === "recon" ? "on" : ""}`}
                  onClick={() => setExpandedMedia("recon")}
                >
                  ● Life Reconstruction
                </button>
              )}
              {skullFor(selected.id) && (
                <button
                  type="button"
                  className={`expanded-tab ${expandedMedia === "fossil" ? "on" : ""}`}
                  onClick={() => setExpandedMedia("fossil")}
                >
                  ● Fossil Specimen
                </button>
              )}
            </div>
            <button
              type="button"
              className="x"
              onClick={() => setExpandedMedia(null)}
              aria-label="Close enlarged view"
              title="Close enlarged view (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {(() => {
            const isRecon = expandedMedia === "recon" && reconFor(selected.id);
            const media = isRecon ? reconFor(selected.id) : skullFor(selected.id);
            if (!media) return null;
            const imgUrl = typeof media === "object" ? media.url : media;
            const author = media.author || "Unknown";
            const license = media.license || "CC BY-SA";
            const source = media.source || "#";

            return (
              <div className="expanded-body">
                <div
                  className="expanded-img-stage"
                  onClick={() => setExpandedMedia(null)}
                  title="Click image to close preview"
                >
                  <img src={imgUrl} alt={`${selected.genus} ${selected.sp} enlarged view`} />
                </div>
                <div className="expanded-caption">
                  <div className="expanded-title-line">
                    <strong>{isRecon ? "Life / Facial Reconstruction" : media.specimen || "Fossil Specimen"}</strong>
                    <span className="expanded-license-badge">{license}</span>
                  </div>
                  <div className="expanded-credit-line">
                    <span className="expanded-author">
                      {isRecon ? `Reconstruction: ${author}` : `Photograph: ${author}`}
                    </span>
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="expanded-source-link"
                      title="View file on Wikimedia Commons"
                    >
                      Wikimedia Commons ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </aside>
      )}
      <div className="dock-container">
        <nav
          className={`legend ${fp ? "fp-off" : ""} ${ancestorsOnly ? "am" : ""} ${selected && !cardMinimized ? "card-open" : ""} ${expandedMedia ? "media-open" : ""}`}
          aria-label="Lineages"
        >
          {Object.entries(CLADES).map(([v, y]) => (
            <button
              onClick={() => onLegendClick(v)}
              className={hiddenClades.has(v) && !ancestorsOnly ? "off" : ""}
              style={{
                "--c": y.color,
              }}
              aria-pressed={!hiddenClades.has(v)}
              key={v}
            >
              <span />
              {y.label}
            </button>
          ))}
          <div className="legend-actions">
            <button
              type="button"
              className={`mode-btn ${ancestorsOnly ? "on" : ""}`}
              onClick={toggleAnc}
              aria-pressed={ancestorsOnly}
              title="Show only the direct line of ancestors leading to Homo sapiens"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx={6} cy={19} r={2.2} />
                <circle cx={12} cy={12} r={2.2} />
                <circle cx={18} cy={5} r={2.2} />
                <path d="M7.6 17.4l2.8-3.8M13.6 10.4l2.8-3.8" />
              </svg>
              Direct Ancestors
            </button>
            <button
              type="button"
              className={`mode-btn hide-labels-btn ${hideLabels ? "on" : ""}`}
              onClick={() => setHideLabels((v) => !v)}
              aria-pressed={hideLabels}
              title="Hide species labels to view bars clearly (L)"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {hideLabels ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
              {hideLabels ? "Show Labels" : "Hide Labels"}
            </button>
          </div>
          {(hiddenClades.size > 0 || ancestorsOnly) && (
            <button
              onClick={() => {
                setHiddenClades(new Set());
                setAncestorsOnly(false);
              }}
              className="reset-filters"
            >
              Show all
            </button>
          )}
        </nav>
        <footer className="dock">
          <button
            className="play"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            title={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={22} /> : timeMa <= 0.05 ? <RotateCcw size={22} /> : <Play size={22} />}
          </button>
          <button
            className={`orbit ${autoRotate ? "" : "off"}`}
            onClick={() => setAutoRotate((v) => !v)}
            aria-label={autoRotate ? "Pause 3D orbit" : "Resume 3D orbit"}
            title={autoRotate ? "Pause 3D rotation" : "Resume 3D rotation"}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={12} cy={12} r={10} />
              <path d="m4.93 4.93 4.24 4.24" />
              <path d="m14.83 9.17 4.24-4.24" />
              <path d="m14.83 14.83 4.24 4.24" />
              <path d="m9.17 14.83-4.24 4.24" />
            </svg>
          </button>
          <div className="readout">
            <strong>{formatMa(timeMa)}</strong>
            <span>
              {timeMa <= 0.004
                ? "1 hominin left standing"
                : `${aliveCount} ${ancestorsOnly ? "direct ancestor" : "hominin"}${aliveCount === 1 ? "" : "s"} alive`}
            </span>
          </div>
          <label className="scrub">
            <span>8 Ma</span>
            <input
              type="range"
              min={0}
              max={8}
              step={0.01}
              value={8 - timeMa}
              aria-label="Time"
              onChange={(e) => {
                setPlaying(false);
                setTimeMa(8 - Number(e.target.value));
              }}
              style={{
                "--p": `${((8 - timeMa) / 8) * 100}%`,
              }}
            />
            <span>Today</span>
          </label>
          <a
            href="https://github.com/ZhiwarSajadi"
            target="_blank"
            rel="noopener noreferrer"
            className="dock-author"
            title="Zhiwar Sajadi on GitHub"
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Zhiwar Sajadi</span>
          </a>
        </footer>
      </div>
      <section className="sr-only" aria-label="All species, in plain text">
        <h2>Hominin species, oldest first</h2>
        <SpeciesList />
      </section>
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
  );
}
