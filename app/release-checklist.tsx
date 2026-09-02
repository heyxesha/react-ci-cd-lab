"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "release-checklist-completed";
const STORAGE_EVENT = "release-checklist-change";

const releaseSteps = [
  {
    id: "review",
    title: "Complete code review",
    description: "All feedback is resolved and the important changes have a second pair of eyes.",
  },
  {
    id: "tests",
    title: "Run automated tests",
    description: "Tests pass locally and confirm the application's main behavior.",
  },
  {
    id: "quality",
    title: "Pass quality gates",
    description: "Formatting, ESLint, and TypeScript checks finish without errors.",
  },
  {
    id: "build",
    title: "Create a production build",
    description:
      "The production build succeeds in a clean environment without hidden dependencies.",
  },
  {
    id: "notes",
    title: "Prepare release notes",
    description: "The team knows what changed and what needs extra attention.",
  },
  {
    id: "rollback",
    title: "Confirm the rollback plan",
    description: "There is a clear way to return to a stable version if something goes wrong.",
  },
] as const;

type StepId = (typeof releaseSteps)[number]["id"];
type Filter = "all" | "completed" | "pending";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Remaining" },
];

function isStepId(value: unknown): value is StepId {
  return releaseSteps.some((step) => step.id === value);
}

function subscribeToCompletedIds(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function getCompletedSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

function parseCompletedIds(value: string): StepId[] {
  try {
    const parsedValue: unknown = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue.filter(isStepId) : [];
  } catch {
    return [];
  }
}

function saveCompletedIds(completedIds: StepId[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export default function ReleaseChecklist() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const completedSnapshot = useSyncExternalStore(
    subscribeToCompletedIds,
    getCompletedSnapshot,
    getServerSnapshot,
  );
  const completedIds = useMemo(() => parseCompletedIds(completedSnapshot), [completedSnapshot]);

  const completedCount = completedIds.length;
  const progress = Math.round((completedCount / releaseSteps.length) * 100);

  const visibleSteps = useMemo(() => {
    if (activeFilter === "completed") {
      return releaseSteps.filter((step) => completedIds.includes(step.id));
    }

    if (activeFilter === "pending") {
      return releaseSteps.filter((step) => !completedIds.includes(step.id));
    }

    return releaseSteps;
  }, [activeFilter, completedIds]);

  function toggleStep(stepId: StepId) {
    const nextCompletedIds = completedIds.includes(stepId)
      ? completedIds.filter((id) => id !== stepId)
      : [...completedIds, stepId];

    saveCompletedIds(nextCompletedIds);
  }

  function resetChecklist() {
    saveCompletedIds([]);
    setActiveFilter("all");
  }

  return (
    <section className="checklist-card" aria-labelledby="checklist-title">
      <div className="progress-section">
        <div className="progress-heading">
          <div>
            <p className="section-label">Overall progress</p>
            <h2 id="checklist-title">
              {completedCount} of {releaseSteps.length} steps
            </h2>
          </div>
          <strong className="progress-value" aria-label={`${progress}% completed`}>
            {progress}%
          </strong>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Release preparation progress"
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <p className="progress-message" aria-live="polite">
          {progress === 100
            ? "Everything is ready — time to ship."
            : "Check off each step as you prepare the release."}
        </p>
      </div>

      <div className="checklist-toolbar">
        <div className="filters" aria-label="Filter checklist items">
          {filters.map((filter) => (
            <button
              className={activeFilter === filter.id ? "filter-button active" : "filter-button"}
              type="button"
              aria-pressed={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
              key={filter.id}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <button
          className="reset-button"
          type="button"
          onClick={resetChecklist}
          disabled={completedCount === 0}
        >
          Reset
        </button>
      </div>

      {visibleSteps.length > 0 ? (
        <ul className="task-list">
          {visibleSteps.map((step, index) => {
            const isCompleted = completedIds.includes(step.id);

            return (
              <li className={isCompleted ? "task-item completed" : "task-item"} key={step.id}>
                <button
                  className="task-toggle"
                  type="button"
                  aria-pressed={isCompleted}
                  aria-label={
                    isCompleted
                      ? `Mark “${step.title}” as remaining`
                      : `Mark “${step.title}” as completed`
                  }
                  onClick={() => toggleStep(step.id)}
                >
                  <span aria-hidden="true">✓</span>
                </button>

                <div className="task-copy">
                  <div className="task-title-row">
                    <span className="task-number">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                  </div>
                  <p>{step.description}</p>
                </div>

                <span className="task-status">{isCompleted ? "Done" : "In progress"}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">✓</span>
          <p>There are no items in this view.</p>
        </div>
      )}
    </section>
  );
}
