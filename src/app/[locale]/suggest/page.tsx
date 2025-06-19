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
  const [userInfo, setUserInfo] = useState<any>(null);
  const locale = useLocale();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = `/${locale}/auth/signin`;
      return;
    }
    const info = getUserInfo();
    setUserInfo(info);
    setAuthChecked(true);
  }, [locale]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        window.location.href = `/${locale}/auth/signin`;
        return;
      }

      const info = getUserInfo();
      setAuthChecked(true);
      setLoading(true);
      try {
        const res = await fetch(`/api/suggest?user_id=${info?.userId}`);
        const data = await res.json();
        setData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-600 flex items-center gap-2">
        <span>🔎</span> {t("nav.suggest") || "Suggestions"}
      </h1>
      {loading && (
        <div className="animate-pulse text-muted-foreground">
          Loading suggestions...
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
                    >
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-blue-600 hover:underline flex items-center gap-2"
                      >
                        {faviconUrl && (
                          <img
                            src={faviconUrl}
                            alt="favicon"
                            className="w-5 h-5 rounded mr-1 border border-slate-200 dark:border-slate-700 bg-white"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
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
