import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Per-section collapse state for the ActivityBar.
 *
 * Keyed by the section's `sectionLabel` string (e.g. "Agent", "System").
 * Sections with an empty label (the top pinned-nav block) are never
 * collapsible — they don't get an entry here either way.
 *
 * Persists to localStorage so the user's collapse preference survives
 * reloads. Default is expanded (absence-of-key = not-collapsed). Mirrors
 * the shape of `useInboxRead` — explicit set on collapse, key-removal
 * on expand — so the persisted state shrinks back to {} when fully
 * expanded.
 */

interface ActivityBarCollapseState {
  collapsedSections: Record<string, true>
}

interface ActivityBarCollapseActions {
  toggleSection: (name: string) => void
  isCollapsed: (name: string) => boolean
}

export const useActivityBarCollapse = create<ActivityBarCollapseState & ActivityBarCollapseActions>()(
  persist(
    (set, get) => ({
      collapsedSections: {},
      toggleSection: (name) =>
        set((s) => {
          const next = { ...s.collapsedSections }
          if (next[name]) delete next[name]
          else next[name] = true
          return { collapsedSections: next }
        }),
      isCollapsed: (name) => Boolean(get().collapsedSections[name]),
    }),
    { name: 'openalice.activitybar-sections.v1', version: 1 },
  ),
)
