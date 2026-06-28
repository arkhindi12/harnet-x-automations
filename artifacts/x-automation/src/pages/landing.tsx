import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiZap, FiDownload, FiClock, FiShield, FiTrendingUp, FiLayers, FiCheck, FiArrowRight } from "react-icons/fi";

const features = [
  {
    icon: FiZap,
    title: "Auto Grab Media",
    desc: "Otomatis scrape video & gambar dari timeline, status, dan reply. Tidak perlu manual satu per satu.",
  },
  {
    icon: FiDownload,
    title: "Upload Otomatis",
    desc: "Langsung upload ke Streamtape atau DoodStream secara paralel. Hemat waktu berjam-jam.",
  },
  {
    icon: FiClock,
    title: "Scheduler 24/7",
    desc: "Atur jadwal grab otomatis. Sistem bekerja non-stop bahkan saat kamu tidur.",
  },
  {
    icon: FiShield,
    title: "Smart Extractor",
    desc: "Deteksi video dari link eksternal, redirect chain, dan halaman embed secara otomatis.",
  },
  {
    icon: FiTrendingUp,
    title: "Auto Post & Embed",
    desc: "Posting otomatis ke akun X dengan template kustom. Embed video langsung ke halaman kamu.",
  },
  {
    icon: FiLayers,
    title: "Multi Account",
    desc: "Kelola banyak akun X sekaligus. Rotasi cookie dan proxy untuk menghindari limit.",
  },
];

type PlanData = {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string | null;
  features: string[];
  ctaText: string;
  isPopular: boolean;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Landing() {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [demoUrl, setDemoUrl] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<any>(null);
  const [demoError, setDemoError] = useState("");
  const [demoRemaining, setDemoRemaining] = useState<number | null>(null);

  const handleDemoExtract = async () => {
    if (!demoUrl.trim()) return;
    setDemoLoading(true);
    setDemoError("");
    setDemoResult(null);
    try {
      const res = await fetch("/api/downloader/smart", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Public-Trial": "1" },
        body: JSON.stringify({ url: demoUrl.trim() }),
      });
      const remaining = res.headers.get("X-Trial-Remaining");
      if (remaining !== null) setDemoRemaining(Number(remaining));
      const data = await res.json();
      if (!res.ok) {
        setDemoError(data.error || "Video tidak ditemukan");
      } else {
        setDemoResult(data);
      }
    } catch {
      setDemoError("Tidak bisa terhubung ke server");
    } finally {
      setDemoLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-24 md:pt-32 md:pb-36 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
            <FiZap className="w-3 h-3" />
            Autopilot Content Machine
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Grab, Upload, Post.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Semuanya Otomatis.
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Berhenti buang waktu download manual. X Automation scrape video & gambar dari X,
            upload ke hosting, dan posting ulang — semua berjalan sendiri 24/7.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
            >
              Lihat Harga <FiArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Lihat Fitur
            </a>
          </div>
        </motion.div>
      </section>



      {/* Public Video Downloader Trial */}
      <section id="video-downloader" className="px-6 pb-20 -mt-10 relative z-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-cyan-500/30 bg-gray-950/90 p-6 md:p-8 shadow-2xl shadow-cyan-500/10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium mb-3">
                <FiDownload className="w-3 h-3" /> Gratis 5x Test
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Video Downloader</h2>
              <p className="text-sm text-gray-400 mt-2">Coba Smart Extract dari link t.co, vid30s, Vidara, dan hosting video lain. Setelah 5x test wajib register dan pilih paket bulanan.</p>
            </div>
            <a href="/register" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors">
              Register <FiArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDemoExtract()}
              placeholder="Paste link video: https://t.co/..."
              className="flex-1 rounded-lg border border-gray-700 bg-black px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleDemoExtract}
              disabled={demoLoading || !demoUrl.trim()}
              className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-6 py-3 text-sm font-bold text-white transition-colors"
            >
              {demoLoading ? "Extracting..." : "Smart Extract"}
            </button>
          </div>
          {demoRemaining !== null && <p className="mt-3 text-xs text-cyan-300">Sisa test gratis: {demoRemaining}x</p>}
          {demoError && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {demoError} <a href="/register" className="underline font-semibold">Register sekarang</a>
            </div>
          )}
          {demoResult && (
            <div className="mt-5 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 flex gap-4 items-center">
              {demoResult.thumbnail && <img src={demoResult.thumbnail} alt="thumbnail" className="h-20 w-32 rounded-lg object-cover border border-violet-500/40" />}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-violet-200 truncate">{demoResult.title || "Video ditemukan"}</p>
                <p className="text-xs text-gray-400 mt-1">{demoResult.uploader || "Smart Extract"} • {demoResult.ext?.toUpperCase?.() || "VIDEO"}</p>
                <div className="mt-3 flex gap-2">
                  <a href={demoResult.directUrl} target="_blank" rel="noreferrer" className="rounded-md bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-semibold text-white">Buka Video</a>
                  <a href="/register" className="rounded-md border border-gray-700 hover:border-gray-500 px-4 py-2 text-xs font-semibold text-gray-200">Upgrade Unlimited</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-12 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          <div>
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-sm text-gray-500 mt-1">User Aktif</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">1.2M+</div>
            <div className="text-sm text-gray-500 mt-1">Media Ter-grab</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">99.9%</div>
            <div className="text-sm text-gray-500 mt-1">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-sm text-gray-500 mt-1">Auto Pilot</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Dari scraping sampai posting, semua fitur dalam satu dashboard.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-blue-500/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <f.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Cara Kerjanya
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Tambah Target", desc: "Masukkan username atau URL status X yang ingin kamu grab." },
              { step: "02", title: "Sistem Bekerja", desc: "Auto grab media, extract video, upload ke hosting pilihan kamu." },
              { step: "03", title: "Profit", desc: "Konten siap tayang. Auto post atau embed di website kamu." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-5xl font-bold text-blue-500/20 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 md:py-28 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pilih Plan yang Cocok
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Mulai dari yang kecil, scale up kapan saja. Tanpa kontrak, batal kapan aja.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`relative p-8 rounded-2xl border ${
                  plan.isPopular
                    ? "border-blue-500 bg-gradient-to-b from-blue-500/10 to-transparent shadow-lg shadow-blue-500/10"
                    : "border-gray-800 bg-gray-900/50"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-xs font-semibold">
                    Paling Populer
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Rp {plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <FiCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`/checkout?plan=${plan.id}`}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    plan.isPopular
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-200"
                  }`}
                >
                  {plan.ctaText}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-6">
            {[
              { q: "Apakah akun X saya aman?", a: "Ya. Kami menggunakan cookie-based auth dengan rotasi proxy untuk meminimalkan risiko. Sistem dirancang agar tidak trigger rate limit." },
              { q: "Bisa grab dari akun private?", a: "Bisa, selama akun cookie yang kamu gunakan sudah follow akun private tersebut." },
              { q: "Video di-upload kemana?", a: "Kamu bisa pilih Streamtape, DoodStream, atau keduanya. File video langsung di-upload dari server kami." },
              { q: "Bisa batal langganan kapan saja?", a: "Tentu. Tidak ada kontrak. Batal kapan saja dan akses tetap aktif sampai akhir periode billing." },
              { q: "Ada trial gratis?", a: "Hubungi kami untuk mendapatkan akses trial 3 hari di plan Starter." },
            ].map((item) => (
              <div key={item.q} className="border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Autopilot Konten Kamu?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Bergabung dengan ratusan user yang sudah menghemat waktu berjam-jam setiap hari.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-colors"
          >
            Mulai Sekarang <FiArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-800/50 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} X Automation. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
