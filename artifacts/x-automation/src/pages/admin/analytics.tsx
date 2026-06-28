import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin-sidebar";
import { FiUsers, FiDownload, FiGlobe, FiClock, FiLink, FiActivity } from "react-icons/fi";

type Stats = {
  totalUsers: number;
  activeUsers: number;
  totalVisitors: number;
  totalDownloaderTests: number;
};

type DayCount = { day: string; count: number };

type UrlCount = { url_tested: string; count: number };

type TestRow = {
  id: number;
  ts: string;
  user_id: number | null;
  email: string | null;
  ip: string | null;
  ua: string | null;
  url_tested: string | null;
  result: string | null;
  plan: string | null;
};

type VisitorRow = {
  id: number;
  ts: string;
  user_id: number | null;
  email: string | null;
  ip: string | null;
  ua: string | null;
  path: string | null;
  referrer: string | null;
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

function formatDate(ts: string) {
  try {
    return new Date(ts).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return ts;
  }
}

function shortUa(ua: string | null) {
  if (!ua) return "-";
  const m = ua.match(/(Chrome|Firefox|Safari|Edg|OPR)\/[\d.]+|Android|iPhone|iPad|Windows NT|Mac OS X|Linux/gi);
  return m ? m.slice(0, 3).join(" · ") : ua.slice(0, 40);
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pageviews, setPageviews] = useState<DayCount[]>([]);
  const [downloaderTests, setDownloaderTests] = useState<DayCount[]>([]);
  const [topUrls, setTopUrls] = useState<UrlCount[]>([]);
  const [recentTests, setRecentTests] = useState<TestRow[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<VisitorRow[]>([]);
  const [days, setDays] = useState(7);
  const [tab, setTab] = useState<"downloader" | "visitors">("downloader");

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/admin/analytics?days=${days}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setPageviews(d.pageviews || []);
        setDownloaderTests(d.downloaderTests || []);
        setTopUrls(d.topUrls || []);
        setRecentTests(d.recentTests || []);
        setRecentVisitors(d.recentVisitors || []);
      })
      .catch(() => {});
  }, [days]);

  const maxPv = Math.max(1, ...pageviews.map((p) => Number(p.count)));
  const maxDt = Math.max(1, ...downloaderTests.map((p) => Number(p.count)));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <AdminSidebar active="analytics" />
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-gray-800/40 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FiActivity className="text-blue-400" /> Visitor Analytics
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Monitor traffic, downloader tests, dan URL yang paling sering dites.</p>
          </div>
          <div className="flex items-center gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  days === d ? "bg-blue-600 text-white" : "bg-gray-800/60 text-gray-400 hover:text-white"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Total Visitors" value={stats?.totalVisitors ?? "-"} icon={FiUsers} color="from-blue-500 to-blue-600" />
            <StatCard label="Downloader Tests" value={stats?.totalDownloaderTests ?? "-"} icon={FiDownload} color="from-purple-500 to-purple-600" />
            <StatCard label="Total Users" value={stats?.totalUsers ?? "-"} icon={FiGlobe} color="from-cyan-500 to-cyan-600" />
            <StatCard label="Active Users" value={stats?.activeUsers ?? "-"} icon={FiClock} color="from-emerald-500 to-emerald-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Pageviews / hari" data={pageviews} max={maxPv} color="bg-blue-500" />
            <ChartCard title="Downloader Tests / hari" data={downloaderTests} max={maxDt} color="bg-purple-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 rounded-xl border border-gray-800/60 bg-[#12121a] p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiLink className="text-yellow-400" />
                <h3 className="text-sm font-semibold">Top URL yang dites</h3>
              </div>
              <div className="space-y-2 max-h-96 overflow-auto pr-2">
                {topUrls.slice(0, 25).map((row, i) => (
                  <div key={row.url_tested + i} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 w-6 text-right">{i + 1}</span>
                    <span className="truncate flex-1 text-gray-200" title={row.url_tested}>{row.url_tested}</span>
                    <span className="rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-2 py-0.5 text-[10px] font-semibold">{row.count}x</span>
                  </div>
                ))}
                {topUrls.length === 0 && <p className="text-xs text-gray-500">Belum ada data.</p>}
              </div>
            </div>

            <div className="lg:col-span-2 rounded-xl border border-gray-800/60 bg-[#12121a] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiActivity className="text-blue-400" />
                  <h3 className="text-sm font-semibold">Log Terbaru</h3>
                </div>
                <div className="flex gap-1 text-xs">
                  <button onClick={() => setTab("downloader")} className={`px-3 py-1 rounded-md ${tab === "downloader" ? "bg-blue-600 text-white" : "bg-gray-800/60 text-gray-400"}`}>Downloader</button>
                  <button onClick={() => setTab("visitors")} className={`px-3 py-1 rounded-md ${tab === "visitors" ? "bg-blue-600 text-white" : "bg-gray-800/60 text-gray-400"}`}>Visitors</button>
                </div>
              </div>
              {tab === "downloader" ? (
                <div className="space-y-2 max-h-96 overflow-auto pr-2">
                  {recentTests.map((row) => (
                    <div key={row.id} className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-gray-400">{formatDate(row.ts)}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${row.result === "success" ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}>{row.result || "-"}</span>
                      </div>
                      <p className="truncate text-gray-200" title={row.url_tested || ""}>{row.url_tested || "-"}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-500">
                        <span>{row.ip || "-"}</span>
                        <span>· {row.email || (row.user_id ? `user#${row.user_id}` : "guest")}</span>
                        {row.plan && <span>· plan:{row.plan}</span>}
                        <span className="truncate max-w-[200px]" title={row.ua || ""}>{shortUa(row.ua)}</span>
                      </div>
                    </div>
                  ))}
                  {recentTests.length === 0 && <p className="text-xs text-gray-500">Belum ada downloader test.</p>}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-auto pr-2">
                  {recentVisitors.map((row) => (
                    <div key={row.id} className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-gray-400">{formatDate(row.ts)}</span>
                        <span className="text-gray-500">{row.ip}</span>
                      </div>
                      <p className="truncate text-gray-200" title={row.path || ""}>{row.path || "-"}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-500">
                        <span>{row.email || (row.user_id ? `user#${row.user_id}` : "guest")}</span>
                        {row.referrer && <span className="truncate max-w-[240px]" title={row.referrer}>← {row.referrer}</span>}
                        <span className="truncate max-w-[200px]" title={row.ua || ""}>{shortUa(row.ua)}</span>
                      </div>
                    </div>
                  ))}
                  {recentVisitors.length === 0 && <p className="text-xs text-gray-500">Belum ada visitor.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={0}
      className="relative overflow-hidden rounded-xl border border-gray-800/60 bg-[#12121a] p-5 group hover:border-gray-700/60 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} p-2 text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </motion.div>
  );
}

function ChartCard({ title, data, max, color }: { title: string; data: DayCount[]; max: number; color: string }) {
  return (
    <div className="rounded-xl border border-gray-800/60 bg-[#12121a] p-5">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      <div className="flex items-end gap-1 h-32">
        {data.map((d) => {
          const h = Math.max(4, (Number(d.count) / max) * 100);
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full rounded-t ${color}`} style={{ height: `${h}%` }} title={`${d.count}`} />
              <span className="text-[9px] text-gray-500">{new Date(d.day).getDate()}</span>
            </div>
          );
        })}
        {data.length === 0 && <p className="text-xs text-gray-500">Belum ada data.</p>}
      </div>
    </div>
  );
}
