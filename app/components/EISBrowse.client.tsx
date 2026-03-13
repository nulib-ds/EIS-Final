"use client";

import { useState, useEffect, useMemo } from "react";
import { getBasePath } from "../js/getBasePath";

interface EISRecord {
  title: string;
  thumbnail: string;
  year: string;
  state: string;
  themes: string[];
  status: string;
  manifestUrl: string;
}

interface SearchRecord {
  title: string;
  href: string;
  thumbnail?: string;
  type: string;
}

const INDEX_URL =
  "https://raw.githubusercontent.com/gracegormley-gkg/canumpy-/main/eis-index.json";

type GroupBy = "state" | "year" | "theme" | null;

function buildSearchLink(title: string): string {
  const base = getBasePath();
  return `${base}/search?q=${encodeURIComponent(title)}`;
}

function buildHrefMap(searchRecords: SearchRecord[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const r of searchRecords) {
    if (r.type === "work" && r.title && r.href) {
      if (!map.has(r.title)) map.set(r.title, r.href);
    }
  }
  return map;
}

function groupRecords(
  records: EISRecord[],
  by: GroupBy,
): [string, EISRecord[]][] {
  if (!by) return [["", records]];

  const groups = new Map<string, EISRecord[]>();

  for (const r of records) {
    const keys: string[] =
      by === "theme"
        ? r.themes.length > 0
          ? r.themes
          : ["Uncategorized"]
        : by === "year"
          ? [r.year || "Unknown Year"]
          : [r.state || "Unknown"];

    for (const key of keys) {
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    }
  }

  const sorted = [...groups.entries()].sort(([a], [b]) => {
    if (by === "year") {
      const ya = parseInt(a) || 0;
      const yb = parseInt(b) || 0;
      return ya - yb;
    }
    return a.localeCompare(b);
  });

  return sorted;
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Complete"
      ? "canopy-badge--complete"
      : status === "Incomplete"
        ? "canopy-badge--incomplete"
        : "canopy-badge--not-started";
  return <span className={`canopy-badge ${cls}`}>{status}</span>;
}

function WorkCard({
  record,
  href,
}: {
  record: EISRecord;
  href: string;
}) {
  return (
    <a href={href} className="eis-browse-card">
      <div className="eis-browse-card__thumb">
        {record.thumbnail ? (
          <img src={record.thumbnail} alt="" loading="lazy" />
        ) : (
          <div className="eis-browse-card__thumb--placeholder" />
        )}
      </div>
      <div className="eis-browse-card__body">
        <p className="eis-browse-card__title">{record.title}</p>
        <div className="eis-browse-card__meta">
          {record.year && <span>{record.year}</span>}
          {record.state && <span>{record.state}</span>}
          <StatusBadge status={record.status} />
        </div>
        {record.themes.length > 0 && (
          <div className="eis-browse-card__themes">
            {record.themes.map((t) => (
              <span key={t} className="eis-browse-card__tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

export default function EISBrowse() {
  const [records, setRecords] = useState<EISRecord[]>([]);
  const [hrefMap, setHrefMap] = useState<Map<string, string>>(new Map());
  const [groupBy, setGroupBy] = useState<GroupBy>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = getBasePath();
    const searchUrl = `${base}/api/search-records.json`;

    Promise.all([
      fetch(INDEX_URL).then((r) => r.json()),
      fetch(searchUrl)
        .then((r) => r.json())
        .catch(() => []),
    ])
      .then(([idx, searchRecords]: [EISRecord[], SearchRecord[]]) => {
        setRecords(idx);
        setHrefMap(buildHrefMap(searchRecords));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load records.");
        setLoading(false);
      });
  }, []);

  const grouped = useMemo(
    () => groupRecords(records, groupBy),
    [records, groupBy],
  );

  const toggles: { label: string; value: GroupBy }[] = [
    { label: "Group by State", value: "state" },
    { label: "Group by Year", value: "year" },
    { label: "Group by Theme", value: "theme" },
  ];

  if (loading) return <div className="eis-browse-loading">Loading…</div>;
  if (error) return <div className="eis-browse-error">{error}</div>;

  return (
    <div className="eis-browse">
      <div className="eis-browse-toolbar">
        <span className="eis-browse-toolbar__label">
          {records.length} records
        </span>
        <div className="eis-browse-toolbar__filters">
          {toggles.map(({ label, value }) => (
            <button
              key={value}
              className={`eis-browse-filter-btn${groupBy === value ? " eis-browse-filter-btn--active" : ""}`}
              onClick={() => setGroupBy(groupBy === value ? null : value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {grouped.map(([groupKey, groupRecords]) => (
        <section key={groupKey || "__all"} className="eis-browse-group">
          {groupKey && <h2 className="eis-browse-group__heading">{groupKey}</h2>}
          <div className="eis-browse-grid">
            {groupRecords.map((r) => {
              const href =
                hrefMap.get(r.title) || buildSearchLink(r.title);
              return <WorkCard key={r.manifestUrl} record={r} href={href} />;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
