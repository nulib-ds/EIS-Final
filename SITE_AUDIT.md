# EIS Archives — Site Audit
_Generated 2026-03-19_

---

## Dead Code

### Unused Components (registered but never used in any MDX file)

| File | Registered as | Status |
|------|--------------|--------|
| `app/components/Example.tsx` | `Example` (mdx.tsx line 9) | Boilerplate template — safe to delete |
| `app/components/Example.client.tsx` | `ExampleClient` (mdx.tsx line 16) | Boilerplate template — safe to delete |
| `app/components/StoryMapJS.client.tsx` | `StoryMapJS` (mdx.tsx line 18) | Fully functional but never instantiated anywhere |

### Unused Imports

- **`app/components/LightboxImage.client.tsx` line 2:** `import { getBasePath } from "../js/getBasePath"` — `getBasePath` is imported but never called inside the component.

---

## Broken References

None found. All component usages in MDX files have matching registrations in `mdx.tsx`, and all image paths checked resolve correctly.

---

## Placeholder / Boilerplate Content

- **`content/_app.mdx` line 62:** Footer reads `"Copyright 2025 Site Title, MIT License. A Canopy IIIF Project."` — "Site Title" is a default placeholder, should be "EIS Archives".
- **`canopy.yml`** — No description or title customization beyond `title: EIS Archives`.

---

## Inconsistencies

### Base URL trailing slash
- `canopy.yml` line 3: `https://nulib-ds.github.io/EIS-Final/` ← has trailing slash
- `app/components/SigmaExample.Client.jsx` line 8: `https://nulib-ds.github.io/EIS-Final` ← no trailing slash
- `app/components/EISMap.client.jsx` line 6: `https://nulib-ds.github.io/EIS-Final` ← no trailing slash

Functionally compatible (paths are concatenated with `/`), but worth keeping consistent.

---

## Component Issues / Concerns

- **`app/components/EISFilterBar.client.tsx`** — The `YEARS` filter list appears to cover only a partial range (1970–1981). If the collection has documents outside this range they won't be filterable by year.
- **`app/components/EISAnnotations.client.tsx`** — Returns `null` and works via DOM side-effects. Functional, but a non-standard React pattern.
- **`app/components/EISFilterBar.client.tsx` line 1** — Has a `"use client"` directive (Next.js convention) but this is a Canopy project. Not harmful, just unnecessary noise.

---

## Summary

| Severity | Count | Items |
|----------|-------|-------|
| Critical | 0 | — |
| Medium | 1 | Footer "Site Title" placeholder |
| Minor | 4 | 3 unused template components, 1 unused import |
| Info | 2 | Base URL trailing slash inconsistency, partial YEARS filter range |

**All theme names match** between `SigmaExample.Client.jsx` and `EISFilterBar.client.tsx`. All collection URLs point consistently to `collection-eis-v4.json`.
