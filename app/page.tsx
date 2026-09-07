import ReleaseChecklist from "./release-checklist";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          Frontend release workflow
        </div>

        <h1 id="page-title">
          Release <span>Checklist</span>
        </h1>

        <p className="hero-copy">
          A simple checklist that helps your team remember every important step before shipping a
          new version.
        </p>

        <dl className="release-meta">
          <div>
            <dt>Environment</dt>
            <dd>Production</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>Frontend</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>In progress</dd>
          </div>
        </dl>
      </section>

      <ReleaseChecklist />

      <footer className="page-footer">
        <span>Progress is saved in this browser</span>
        <span aria-hidden="true">•</span>
        <span>Next.js + GitHub Actions</span>
      </footer>
    </main>
  );
}
