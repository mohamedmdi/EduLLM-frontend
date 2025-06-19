"use client";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { isAuthenticated, getUserInfo } from "@/lib/auth-utils";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface SuggestData {
  topics: string[];
  search_results: Record<string, SearchResult[]>;
}

export default function SuggestPage() {
  const t = useTranslations();
  const [data, setData] = useState<SuggestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = `/${locale}/auth/signin`;
      return;
    }
  }, [locale]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        window.location.href = `/${locale}/auth/signin`;
        return;
      }

      const info = getUserInfo();
      setLoading(true);
      try {
        const res = await fetch(`/api/suggest?user_id=${info?.userId}`);
        const data = await res.json();        setData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        setError("Failed to load suggestions");
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-600 flex items-center gap-2">
        <span>🔎</span> {t("nav.suggest") || "Suggestions"}
      </h1>
      {loading && (
        <div className="space-y-8">
          {[1, 2].map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 border border-emerald-100 dark:border-slate-700 animate-pulse"
            >
              <div className="h-6 w-1/3 bg-emerald-100 dark:bg-slate-700 rounded mb-4 shimmer" />
              <ul className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <li
                    key={i}
                    className="border-b last:border-b-0 border-slate-200 dark:border-slate-700 pb-4 last:pb-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded mr-1 shimmer" />
                      <div className="h-5 w-1/4 bg-slate-200 dark:bg-slate-800 rounded shimmer" />
                    </div>
                    <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-700 rounded shimmer" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-red-500 font-semibold">{error}</div>}
      {data && data.topics.length > 0 ? (
        <div className="space-y-8">
          {data.topics.map((topic) => (
            <div
              key={topic}
              className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 border border-emerald-100 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold mb-4 text-emerald-700 flex items-center gap-2">
                <span>📚</span> {topic}
              </h2>
              <ul className="space-y-4">
                {data.search_results[topic]?.map((item, idx) => {
                  // Extract domain for favicon
                  let domain = "";
                  try {
                    domain = new URL(item.link).hostname;
                  } catch {}
                  const faviconUrl = domain
                    ? `https://${domain}/favicon.ico`
                    : undefined;
                  return (
                    <li
                      key={idx}
                      className="border-b last:border-b-0 border-slate-200 dark:border-slate-700 pb-4 last:pb-0"
                    >                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-blue-600 hover:underline flex items-center gap-2"
                      >
                        {faviconUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={faviconUrl}
                            alt="favicon"
                            className="w-5 h-5 rounded mr-1 border border-slate-200 dark:border-slate-700 bg-white"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        {item.title}
                        <span className="ml-1">↗</span>
                      </a>
                      <p className="text-slate-700 dark:text-slate-300 mt-1">
                        {item.snippet}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-muted-foreground">No suggestions found.</div>
        )
      )}
    </div>
  );
}

// Add shimmer effect via global style (Tailwind doesn't have shimmer by default)
// You can move this to your global CSS if you prefer
if (typeof window !== "undefined") {
  const styleId = "skeleton-shimmer-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .shimmer {
        position: relative;
        overflow: hidden;
      }
      .shimmer::after {
        content: '';
        position: absolute;
        top: 0;
        left: -150px;
        width: 150px;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        animation: shimmer 1.2s infinite;
      }
      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
    `;
    document.head.appendChild(style);
  }
}
