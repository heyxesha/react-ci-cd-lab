import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import ReleaseChecklist from "./release-checklist";

const STORAGE_KEY = "release-checklist-completed";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("ReleaseChecklist", () => {
  test("shows every release step and an empty initial progress", () => {
    render(<ReleaseChecklist />);

    expect(screen.getByRole("heading", { level: 2, name: "0 of 6 steps" })).toBeDefined();
    expect(screen.getByRole("heading", { level: 3, name: "Complete code review" })).toBeDefined();
    expect(screen.getAllByRole("button", { name: /Mark .* as completed/ })).toHaveLength(6);
  });

  test("completes a step, saves it, and filters the list", () => {
    render(<ReleaseChecklist />);

    fireEvent.click(
      screen.getByRole("button", { name: "Mark “Complete code review” as completed" }),
    );

    expect(screen.getByRole("heading", { level: 2, name: "1 of 6 steps" })).toBeDefined();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('["review"]');

    fireEvent.click(screen.getByRole("button", { name: "Completed" }));

    expect(screen.getByRole("heading", { level: 3, name: "Complete code review" })).toBeDefined();
    expect(screen.queryByRole("heading", { level: 3, name: "Run automated tests" })).toBeNull();
  });
});
