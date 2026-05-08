"use client";
import { useState } from "react";
import { eventsData } from "@/data/events";

// Terima prop onOpenModal dari page.js
export default function Explore({ onOpenModal }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua Kategori");
  const [activeLocation, setActiveLocation] = useState("Semua Lokasi");
  const [wishlist, setWishlist] = useState([]);

  // Ekstrak Kategori dan Lokasi Unik
  const categories = [
    "Semua Kategori",
    ...new Set(eventsData.map((ev) => ev.category)),
  ];
  const locations = [
    "Semua Lokasi",
    ...new Set(eventsData.map((ev) => ev.location)),
  ];

  // Logika Filter Multi-Dimensi (Pencarian + Kategori + Lokasi)
  const filteredEvents = eventsData.filter((ev) => {
    const matchCategory =
      activeCategory === "Semua Kategori" || ev.category === activeCategory;
    const matchLocation =
      activeLocation === "Semua Lokasi" || ev.location === activeLocation;
    const matchSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.eo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchLocation && matchSearch;
  });

  // Toggle Wishlist
  const toggleWishlist = (e, id) => {
    e.stopPropagation(); // Mencegah klik menembus ke kartu (agar modal tidak ikut terbuka)
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-12">
        <h1 className="font-heading text-4xl lg:text-5xl font-extrabold text-dark mb-4 tracking-tight">
          Eksplorasi{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
            Workshop IT
          </span>
        </h1>
        <p className="text-slate-500 text-lg mb-8 max-w-2xl">
          Temukan acara, bootcamp, dan seminar teknologi terbaik untuk
          meningkatkan karir profesionalmu.
        </p>

        {/* --- KONTROL FILTER --- */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow group">
              <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                search
              </span>
              <input
                type="text"
                placeholder="Cari acara"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-dark text-sm rounded-full pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            {/* Dropdown Filter Lokasi */}
            <div className="relative min-w-[200px]">
              <select
                value={activeLocation}
                onChange={(e) => setActiveLocation(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-dark text-sm rounded-full px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Filter Kategori (Pills) */}
          <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                  ${
                    activeCategory === cat
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/30"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- EVENT GRID --- */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((ev) => {
            const isFull = ev.quota === 0;
            const isWishlisted = wishlist.includes(ev.id);
            const quotaPercentage = ((ev.max - ev.quota) / ev.max) * 100;

            return (
              <div
                key={ev.id}
                onClick={() => onOpenModal(ev)} // Memicu GlobalModal.js
                className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* Thumbnail Section */}
                <div className="h-56 rounded-[1.5rem] overflow-hidden relative mb-4">
                  <img
                    src={ev.img}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={ev.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent opacity-60"></div>

                  {/* Kategori Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-brand-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                    {ev.category}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(e, ev.id)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center hover:bg-white/40 transition-all z-10"
                  >
                    <span
                      className={`material-icons-round text-lg transition-colors ${isWishlisted ? "text-rose-500" : "text-white"}`}
                    >
                      {isWishlisted ? "favorite" : "favorite_border"}
                    </span>
                  </button>

                  {/* EO Info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center border-2 border-white text-white">
                      <span className="material-icons-round text-sm">
                        domain
                      </span>
                    </div>
                    <span className="text-white font-bold text-sm truncate drop-shadow-md">
                      {ev.eo}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="px-2 pb-2 flex-grow flex flex-col">
                  <h3 className="font-heading text-xl font-bold text-dark leading-tight mb-4 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {ev.title}
                  </h3>

                  {/* Bento Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
                      <span className="material-icons-round text-brand-500 text-base">
                        calendar_month
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          Tanggal
                        </span>
                        <span className="text-xs font-bold text-dark truncate">
                          {ev.date}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
                      <span className="material-icons-round text-rose-500 text-base">
                        schedule
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          Waktu
                        </span>
                        <span className="text-xs font-bold text-dark truncate">
                          {ev.time}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
                      <span className="material-icons-round text-emerald-500 text-base">
                        location_on
                      </span>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          Lokasi
                        </span>
                        <span className="text-xs font-bold text-dark truncate">
                          {ev.venue} ({ev.location})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quota */}
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Ketersediaan
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${isFull ? "bg-rose-100 text-rose-600" : "bg-brand-50 text-brand-600"}`}
                      >
                        {isFull
                          ? "Kapasitas Penuh"
                          : `${ev.quota} Kursi Tersisa`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${isFull ? "bg-rose-500" : "bg-brand-500"}`}
                        style={{ width: `${quotaPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <span className="material-icons-round text-5xl">search_off</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-dark mb-2">
            Acara tidak ditemukan
          </h3>
          <p className="text-slate-500 max-w-md">
            Maaf, kami tidak menemukan workshop yang cocok dengan filter yang
            Anda pilih.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("Semua Kategori");
              setActiveLocation("Semua Lokasi");
            }}
            className="mt-6 px-6 py-3 bg-brand-50 text-brand-600 font-bold rounded-xl hover:bg-brand-100 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
}
