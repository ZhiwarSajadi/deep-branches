import { SHOW_SKULL_ILLUSTRATIONS } from "../config.js";
import { SITE } from "../site.js";

const ext = { target: "_blank", rel: "noopener noreferrer" };

/** The "About & credits" text. Shared by the dialog and the no-WebGL fallback page. */
export function AboutContent() {
  const base = import.meta.env.BASE_URL;
  return (
    <>
      <section>
        <h3>What you are looking at</h3>
        <p>
          {SITE.brand} is an interactive 3D map of the human family tree. Each bar is a hominin species,
          stretched across the time it is known from the fossil record (Ma = million years ago, ka = thousand
          years ago). Press play, drag the timeline, or click a species to read a short summary and see its
          sources. Double-click a species to step inside its bar and look around in first-person view.
        </p>
        <p>Solid lines are supported links between species. Dashed lines mark links whose ancestry is debated.</p>
      </section>

      <section>
        <h3>A simplified picture, not a settled one</h3>
        <p>
          Researchers disagree about which fossils belong to which species, how many species there are, and how
          they are related. Real evolution looked more like a braided stream than a clean tree: populations
          split, merged and interbred (many living people carry small amounts of Neanderthal DNA, and some
          populations carry Denisovan DNA). The dates and relationships shown follow the sources linked on each
          card and will need revising as new fossils and methods appear.
        </p>
      </section>

      <section>
        <h3>Accuracy and AI assistance</h3>
        <p>
          The summaries were drafted with the help of AI and curated by the project&rsquo;s author. They have
          not been peer reviewed unless stated otherwise, and they may contain mistakes or oversimplifications.
          For anything that matters (homework, citations, publications) please check the primary sources linked
          on each card.
        </p>
        {SITE.reviewedBy && <p>{SITE.reviewedBy}</p>}
      </section>

      <section>
        <h3>Author &amp; code</h3>
        <p>
          Created by{" "}
          <a href="https://github.com/ZhiwarSajadi" {...ext} className="about-author-link">
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              style={{ display: "inline-block", verticalAlign: "-2px", marginRight: 5 }}
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Zhiwar Sajadi
          </a>
          . Project code and updates are available on GitHub.
        </p>
      </section>

      <section>
        <h3>Free and non-commercial</h3>
        <p>
          {SITE.brand} is a free, non-commercial educational project made by an individual as a personal
          project. It has no ads, no sponsors, no affiliate links, no paywalls and no accounts, and nothing is
          for sale.
        </p>
      </section>

      <section>
        <h3>Privacy</h3>
        <p>
          This site does not use cookies, analytics or third-party trackers, and its fonts and code are served
          from the same place as the page itself. Like any website, the service that hosts it may keep standard
          technical logs (such as IP addresses) outside the author&rsquo;s control. Links on the cards lead to
          other websites that have their own policies.
        </p>
      </section>

      {(SITE.contactEmail || SITE.repoUrl) && (
        <section>
          <h3>Corrections and contact</h3>
          <p>
            Found an error, a broken link or a missing source? Please let us know
            {SITE.contactEmail && (
              <>
                {" "}
                at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
              </>
            )}
            {SITE.repoUrl && (
              <>
                {SITE.contactEmail ? ", or " : " "}
                on the{" "}
                <a href={SITE.repoUrl} {...ext}>
                  project page
                </a>
              </>
            )}
            . The same address is the place to send any copyright or takedown request.
          </p>
        </section>
      )}

      <section>
        <h3>Sources, credits and licences</h3>
        <p>
          Every species card links to the published work it relies on: mainly peer-reviewed papers (via DOI) and
          the Smithsonian Human Origins Program, plus other institutions where cited. These organisations and
          publishers are named as sources only; this project is not affiliated with or endorsed by them.
        </p>
        <p>
          The source code is released under the MIT License. The text and data (species summaries and the
          layout data) are released under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" {...ext}>
            CC BY 4.0
          </a>
          , so you may reuse them with credit. Material on the websites we link to is not covered.
        </p>
        <p>
          Built with React, three.js, React Three Fiber, drei and Lucide icons. Fonts: Playfair Display and Fira
          Sans (SIL Open Font License), self-hosted. Full notices for every bundled library are in{" "}
          <a href={`${base}THIRD_PARTY_LICENSES.txt`} {...ext}>
            THIRD_PARTY_LICENSES.txt
          </a>
          .
        </p>
        {SHOW_SKULL_ILLUSTRATIONS && SITE.skullCredit && (
          <p>Specimen photographs and reconstructions: {SITE.skullCredit}</p>
        )}
      </section>

      <p className="about-version">
        Version {SITE.version} · Last updated {SITE.lastUpdated}
      </p>
    </>
  );
}
