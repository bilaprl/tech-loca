"use client";
import { useState } from "react";
import { eventsData } from "@/data/events";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState(eventsData);

  const [selectedEventForCheckin, setSelectedEventForCheckin] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [selectedParticipantForCert, setSelectedParticipantForCert] =
    useState(null);
  const [isCheckinSessionOpen, setIsCheckinSessionOpen] = useState(false);

  // State untuk Modal Detail Transaksi
  const [selectedTx, setSelectedTx] = useState(null);

  // --- PEMBAIKAN: State searchQuery dipindahkan ke top-level agar tidak melanggar Rules of Hooks ---
  const [searchQuery, setSearchQuery] = useState("");

  // --- DATA STATE ---
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    date: "",
    quota: "",
    location: "",
    venue: "",
    img: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [transactions, setTransactions] = useState([
    {
      id: 102,
      user: "Budi Santoso",
      email: "budi.santoso@student.unsil.ac.id",
      wa: "081234567890",
      school: "Universitas Siliwangi",
      avatar: "https://i.pravatar.cc/150?u=budi",
      event: "UI/UX Masterclass",
      eventDate: "12 Mei 2026",
      eventLoc: "Gedung Rektorat Lt. 2",
      status: "pending",
    },
    {
      id: 105,
      user: "Siti Aminah",
      email: "siti.aminah@gmail.com",
      wa: "089988776655",
      school: "SMKN 1 Tasikmalaya",
      avatar: "https://i.pravatar.cc/150?u=siti",
      event: "Web Dev Unsil",
      eventDate: "15 Mei 2026",
      eventLoc: "Lab Komputer Informatika",
      status: "pending",
    },
  ]);

  const [participants, setParticipants] = useState([
    {
      id: 201,
      name: "Nabila Aprilianti",
      event: "Web Dev Unsil",
      status: "confirmed",
    },
    {
      id: 202,
      name: "Reza Febrian",
      event: "Web Dev Unsil",
      status: "confirmed",
    },
  ]);

  // --- LOGIKA AKSI ---
  const confirmPayment = (id) => {
    alert("Pembayaran Terverifikasi! Tiket User kini telah Aktif (Confirmed).");
    setTransactions(transactions.filter((t) => t.id !== id));
    setSelectedTx(null); // Tutup modal setelah konfirmasi
  };

  const markAsPresent = (id) => {
    alert("Check-in Berhasil! Sertifikat otomatis terbit di akun User.");
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, status: "attended" } : p)),
    );
  };

  // --- HANDLER MANAJEMEN EVENT ---
  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFormData({ ...formData, img: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFile(e.dataTransfer.files[0]);
  };

  const saveEvent = () => {
    if (!formData.title || !formData.date || !formData.img)
      return alert("Lengkapi data!");
    if (isEditing) {
      setEvents(
        events.map((ev) => (ev.id === formData.id ? { ...formData } : ev)),
      );
      alert("Berhasil diperbarui!");
    } else {
      setEvents([{ ...formData, id: Date.now() }, ...events]);
      alert("Berhasil dipublikasikan!");
    }
    resetForm();
  };

  const editEvent = (ev) => {
    setFormData(ev);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEvent = (id) => {
    if (confirm("Hapus event?")) setEvents(events.filter((ev) => ev.id !== id));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      date: "",
      quota: "",
      location: "",
      venue: "",
      img: null,
    });
    setIsEditing(false);
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      {/* --- HEADER COMMAND CENTER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-500 mb-2">
            <span className="material-icons-round text-xl animate-pulse">
              sensors
            </span>
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Live System Admin
            </span>
          </div>
          <h2 className="font-heading text-4xl font-extrabold text-dark tracking-tighter">
            TechLoca <span className="text-slate-400">Command Center</span>
          </h2>
        </div>

        {/* --- SUB-NAVIGATION BENTO STYLE --- */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 w-full md:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Ikhtisar", icon: "grid_view" },
            { id: "events", label: "Event", icon: "confirmation_number" },
            { id: "payments", label: "Verifikasi", icon: "payments" },
            { id: "checkin", label: "Check-in", icon: "qr_code_scanner" },
            { id: "certificates", label: "Certificated", icon: "badge" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                ${activeTab === tab.id ? "bg-white text-dark shadow-md" : "text-slate-500 hover:bg-white/50"}`}
            >
              <span className="material-icons-round text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- 1. MODUL IKHTISAR (OVERVIEW) --- */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-brand-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <p className="relative z-10 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Total Member
              </p>
              <h4 className="relative z-10 text-3xl font-black text-dark tracking-tighter">
                1,284
              </h4>
              <div className="relative z-10 flex items-center gap-1 mt-2 text-brand-600 font-bold text-[10px]">
                <span className="material-icons-round text-xs">
                  trending_up
                </span>
                <span>+48 Minggu ini</span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <p className="relative z-10 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Ticket Confirmed
              </p>
              <h4 className="relative z-10 text-3xl font-black text-dark tracking-tighter">
                842
              </h4>
              <div className="relative z-10 flex items-center gap-1 mt-2 text-emerald-500 font-bold text-[10px]">
                <span className="material-icons-round text-xs">
                  check_circle
                </span>
                <span>Siap Check-in</span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <p className="relative z-10 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Pending Payment
              </p>
              <h4 className="relative z-10 text-3xl font-black text-dark tracking-tighter">
                {transactions.length}
              </h4>
              <div className="relative z-10 flex items-center gap-1 mt-2 text-amber-500 font-bold text-[10px]">
                <span className="material-icons-round text-xs">
                  hourglass_empty
                </span>
                <span>Perlu Verifikasi</span>
              </div>
            </div>

            <div className="bg-dark p-7 rounded-[2.5rem] text-white shadow-xl shadow-dark/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <p className="relative z-10 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Platform Status
              </p>
              <h4 className="relative z-10 text-3xl font-black flex items-center gap-3">
                Live{" "}
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></span>
              </h4>
              <p className="relative z-10 text-[10px] text-slate-400 mt-2 font-medium">
                Region: Tasikmalaya-WestJava
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="font-heading text-xl font-black text-dark">
                    Traffic Pendaftaran
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    Aktivitas 7 Hari Terakhir
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-brand-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-slate-100 rounded-full"></span>
                </div>
              </div>
              <div className="h-64 flex items-end gap-3 justify-between pb-2">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-4"
                  >
                    <div
                      className={`w-full rounded-t-xl transition-all duration-1000 ${i === 3 ? "bg-brand-500 shadow-lg shadow-brand-500/20" : "bg-slate-50"}`}
                      style={{ height: `${h}%` }}
                    ></div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Sen+{i}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
              <h3 className="font-heading text-lg font-black text-dark mb-6">
                Log Aktivitas
              </h3>
              <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2 no-scrollbar">
                {[
                  {
                    user: "Nabila A.",
                    action: "Mendaftar Web Dev",
                    time: "2m ago",
                    icon: "person_add",
                    color: "text-brand-500",
                    bg: "bg-brand-50",
                  },
                  {
                    user: "Budi S.",
                    action: "Bayar UI/UX Masterclass",
                    time: "15m ago",
                    icon: "payments",
                    color: "text-emerald-500",
                    bg: "bg-emerald-50",
                  },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start border-l-2 border-slate-50 pl-4 relative"
                  >
                    <div
                      className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${log.bg}`}
                    ></div>
                    <div
                      className={`w-8 h-8 rounded-xl ${log.bg} ${log.color} flex items-center justify-center shrink-0`}
                    >
                      <span className="material-icons-round text-sm">
                        {log.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark leading-tight">
                        {log.user}{" "}
                        <span className="text-slate-400 font-medium">
                          {log.action}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">
                        {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. MODUL MANAJEMEN EVENT (FULL CRUD) --- */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl h-fit sticky top-32">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-dark">
                {isEditing ? "Edit Detail Event" : "Buat Event Baru"}
              </h3>
              {isEditing && (
                <button
                  onClick={resetForm}
                  className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-lg"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama Workshop / Event"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-500 font-bold text-sm"
              />

              {/* TAMBAHAN: Input Nama Penyelenggara / EO */}
              <input
                type="text"
                placeholder="Nama Penyelenggara (Contoh: BEM Informatika Unsil)"
                value={formData.eo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, eo: e.target.value })
                }
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-500 font-bold text-sm"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">
                    Kuota
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 50"
                    value={formData.quota}
                    onChange={(e) =>
                      setFormData({ ...formData, quota: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    map
                  </span>
                  <input
                    type="text"
                    placeholder="Kota (Contoh: Tasikmalaya)"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:border-brand-500"
                  />
                </div>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    location_on
                  </span>
                  <input
                    type="text"
                    placeholder="Nama Tempat / Venue"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:border-brand-500"
                  />
                </div>
                
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    add_location_alt
                  </span>
                  <input
                    type="url"
                    placeholder="Link Google Maps (URL)"
                    value={formData.maps_url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, maps_url: e.target.value })
                    }
                    className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative p-8 border-2 border-dashed rounded-[2rem] text-center transition-all duration-300
                  ${dragActive ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-brand-300"}
                  ${formData.img ? "bg-slate-900 border-none p-0 h-48 overflow-hidden" : ""}`}
              >
                {formData.img ? (
                  <>
                    <img
                      src={formData.img}
                      className="w-full h-full object-cover opacity-60"
                      alt="Preview"
                    />
                    <button
                      onClick={() => setFormData({ ...formData, img: null })}
                      className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-rose-500 transition-colors"
                    >
                      <span className="material-icons-round text-sm">
                        close
                      </span>
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-white font-black text-xs uppercase tracking-widest">
                        Poster Terpilih
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept="image/*"
                      onChange={(e) => handleFile(e.target.files[0])}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="material-icons-round text-4xl text-slate-300 mb-2">
                        add_photo_alternate
                      </span>
                      <p className="text-[10px] font-black text-slate-400 uppercase">
                        Seret poster ke sini atau klik untuk cari
                      </p>
                    </label>
                  </>
                )}
              </div>

              <button
                onClick={saveEvent}
                className="w-full py-4 bg-dark text-white font-black rounded-2xl shadow-xl shadow-dark/20 hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-icons-round text-sm">
                  {isEditing ? "save" : "rocket_launch"}
                </span>
                {isEditing ? "Simpan Perubahan" : "Publikasikan ke Katalog"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden mb-4">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-1">Live Katalog</h4>
                <p className="text-slate-400 text-xs font-medium">
                  Klik icon mata untuk melihat preview di landing page.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-48 h-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
            </div>

            <div className="space-y-4">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
                      <img
                        src={ev.img}
                        className="w-full h-full object-cover"
                        alt="Event"
                      />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-50 rounded-lg text-[8px] font-black text-brand-600 uppercase tracking-tighter mb-1.5">
                        {ev.location || "Tasikmalaya"}
                      </div>
                      <h4 className="font-bold text-dark text-lg leading-tight">
                        {ev.title}
                      </h4>
                      <div className="flex gap-4 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <span className="material-icons-round text-xs">
                            calendar_today
                          </span>{" "}
                          {ev.date}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <span className="material-icons-round text-xs">
                            group
                          </span>{" "}
                          {ev.quota} Slot
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pr-2">
                    <button
                      onClick={() => editEvent(ev)}
                      className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                    >
                      <span className="material-icons-round text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="w-10 h-10 bg-slate-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <span className="material-icons-round text-sm">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- 3. MODUL VERIFIKASI PEMBAYARAN --- */}
      {activeTab === "payments" && (
        <div className="animate-in fade-in duration-500 space-y-8">
          {/* SELEKSI ACARA (Seperti Fitur Check-in) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-dark uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
                Pilih Acara untuk Verifikasi
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
                {transactions.filter((t) => t.status === "pending").length}{" "}
                Menunggu
              </span>
            </div>

            {/* List Kartu Acara - Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
              {/* Opsi Semua Acara */}
              <div
                onClick={() => setSelectedEventFilter("all")}
                className={`min-w-[140px] p-4 rounded-[2rem] cursor-pointer transition-all border-2 ${
                  selectedEventFilter === "all"
                    ? "border-brand-500 bg-brand-50 text-brand-600 shadow-lg shadow-brand-500/10"
                    : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                }`}
              >
                <span className="material-icons-round mb-2 text-xl">
                  all_inclusive
                </span>
                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">
                  Semua
                  <br />
                  Acara
                </p>
              </div>

              {/* List Acara dari Data (Gunakan Array Unik dari Transactions atau dari state events) */}
              {[...new Set(transactions.map((t) => t.event))].map(
                (eventName) => (
                  <div
                    key={eventName}
                    onClick={() => setSelectedEventFilter(eventName)}
                    className={`min-w-[200px] p-5 rounded-[2.5rem] cursor-pointer transition-all border-2 flex items-center gap-4 ${
                      selectedEventFilter === eventName
                        ? "border-brand-500 bg-brand-50 shadow-lg shadow-brand-500/10"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${selectedEventFilter === eventName ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-400"}`}
                    >
                      <span className="material-icons-round text-lg">
                        confirmation_number
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <p
                        className={`text-[10px] font-black uppercase tracking-tighter truncate ${selectedEventFilter === eventName ? "text-brand-600" : "text-dark"}`}
                      >
                        {eventName}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400">
                        {
                          transactions.filter(
                            (t) =>
                              t.event === eventName && t.status === "pending",
                          ).length
                        }{" "}
                        Pending
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* TABEL TRANSAKSI */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">Peserta</th>
                  <th className="px-8 py-6">Workshop</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions
                  .filter(
                    (t) =>
                      selectedEventFilter === "all" ||
                      t.event === selectedEventFilter,
                  )
                  .map((t) => (
                    <tr
                      key={t.id}
                      className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTx(t)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={t.avatar}
                            className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-white"
                          />
                          <span className="font-bold text-dark text-sm">
                            {t.user}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-semibold text-slate-600">
                        {t.event}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-lg text-[9px] font-black tracking-widest uppercase">
                          Pending
                        </span>
                      </td>
                      <td
                        className="px-8 py-6 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedTx(t)}
                          className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-dark hover:text-white rounded-xl text-[10px] font-black transition-all uppercase tracking-widest"
                        >
                          Cek Detail
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Tampilan jika filter kosong */}
            {transactions.filter(
              (t) =>
                selectedEventFilter === "all" ||
                t.event === selectedEventFilter,
            ).length === 0 && (
              <div className="py-20 text-center">
                <span className="material-icons-round text-slate-200 text-6xl mb-4">
                  payments
                </span>
                <p className="text-slate-400 font-bold text-sm">
                  Tidak ada pembayaran pending untuk acara ini.
                </p>
              </div>
            )}
          </div>

          {/* --- SLIDE-OVER DETAIL PANEL (Desain Tetap) --- */}
          {selectedTx && (
            <div className="fixed inset-0 z-[110] flex justify-end">
              <div
                className="absolute inset-0 bg-dark/20 backdrop-blur-sm"
                onClick={() => setSelectedTx(null)}
              ></div>
              <div className="relative w-full max-w-lg bg-white h-full shadow-2xl p-10 animate-in slide-in-from-right duration-500 overflow-y-auto">
                <button
                  onClick={() => setSelectedTx(null)}
                  className="absolute top-8 right-8 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  <span className="material-icons-round">close</span>
                </button>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-black text-dark mb-1 tracking-tighter">
                      Verifikasi Pembayaran
                    </h3>
                    <p className="text-sm font-medium text-slate-400">
                      Order ID: #{selectedTx.id}
                    </p>
                  </div>

                  {/* USER PROFILE CARD */}
                  <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={selectedTx.avatar}
                        className="w-16 h-16 rounded-2xl object-cover shadow-md"
                      />
                      <div>
                        <h4 className="text-lg font-black text-dark leading-tight">
                          {selectedTx.user}
                        </h4>
                        <p className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                          {selectedTx.school}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-slate-200/50">
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="material-icons-round text-sm">
                          alternate_email
                        </span>
                        <span className="text-xs font-bold">
                          {selectedTx.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="material-icons-round text-sm">
                          phone_iphone
                        </span>
                        <span className="text-xs font-bold">
                          {selectedTx.wa}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* EVENT DETAIL CARD */}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Workshop yang Dipilih
                    </p>
                    <div className="p-6 rounded-[2rem] border-2 border-slate-100 flex gap-5 items-center">
                      <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                        <span className="material-icons-round">event</span>
                      </div>
                      <div>
                        <h5 className="font-black text-dark leading-none mb-2">
                          {selectedTx.event}
                        </h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {selectedTx.eventDate} • {selectedTx.eventLoc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="pt-6 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-400 mb-6 italic">
                      Pastikan bukti transfer di WhatsApp sudah sesuai dengan
                      data di atas sebelum melakukan konfirmasi.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedTx(null)}
                        className="py-4 bg-slate-50 text-slate-400 font-black text-xs rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest"
                      >
                        Tutup
                      </button>
                      <button
                        onClick={() => {
                          confirmPayment(selectedTx.id);
                          setSelectedTx(null);
                        }}
                        className="py-4 bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <span className="material-icons-round text-sm">
                          check_circle
                        </span>
                        Konfirmasi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- 4. MODUL CHECK-IN HARI H (GATE KEEPER PRO V2) --- */}
      {activeTab === "checkin" &&
        (() => {
          const filteredParticipants = participants.filter((p) => {
            const matchEvent = selectedEventForCheckin
              ? p.event === selectedEventForCheckin
              : true;
            const matchSearch =
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.id.toString().includes(searchQuery);
            return matchEvent && matchSearch;
          });

          const totalCount = participants.length;
          const selectedEventData = events.find(
            (e) => e.title === selectedEventForCheckin,
          );
          const totalSelected = participants.filter((p) =>
            selectedEventForCheckin
              ? p.event === selectedEventForCheckin
              : true,
          ).length;
          const attendedCount = participants.filter(
            (p) =>
              p.status === "attended" &&
              (selectedEventForCheckin
                ? p.event === selectedEventForCheckin
                : true),
          ).length;
          const progressPercent =
            totalSelected > 0 ? (attendedCount / totalSelected) * 100 : 0;

          return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              {/* --- HEADER & CONTROL --- */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                      <span className="material-icons-round text-2xl">
                        event_available
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-dark tracking-tight">
                        Konfigurasi Gate
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Pilih event aktif untuk mulai scanning
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      disabled={isCheckinSessionOpen}
                      value={selectedEventForCheckin}
                      onChange={(e) =>
                        setSelectedEventForCheckin(e.target.value)
                      }
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-brand-500 disabled:opacity-60 transition-all"
                    >
                      <option value="">Pilih Event...</option>
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.title}>
                          {ev.title}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        if (!selectedEventForCheckin && !isCheckinSessionOpen)
                          return alert("Pilih event dulu!");
                        setIsCheckinSessionOpen(!isCheckinSessionOpen);
                      }}
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3
                ${isCheckinSessionOpen ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-dark text-white hover:bg-brand-600"}`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${isCheckinSessionOpen ? "bg-white animate-ping" : "bg-slate-400"}`}
                      ></span>
                      {isCheckinSessionOpen ? "Tutup Gerbang" : "Buka Gerbang"}
                    </button>
                  </div>
                </div>

                {/* --- MINI EVENT CARD --- */}
                <div className="bg-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-center">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] mb-2">
                      Event Terpilih
                    </p>
                    <h4 className="text-lg font-bold leading-tight mb-4">
                      {selectedEventForCheckin || "Belum Ada Event"}
                    </h4>
                    {isCheckinSessionOpen && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>Progress Kehadiran</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 transition-all duration-1000"
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10 scale-150">
                    <span className="material-icons-round text-9xl">
                      confirmation_number
                    </span>
                  </div>
                </div>
              </div>

              {isCheckinSessionOpen ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT: SCANNER & SEARCH */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <div className="aspect-square bg-slate-900 rounded-[2rem] relative overflow-hidden group flex items-center justify-center border-4 border-slate-50">
                        {/* Simulasi Frame Scanner */}
                        <div className="absolute inset-0 border-[30px] border-black/40 z-10 pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-brand-500 z-20 rounded-2xl animate-pulse">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-brand-500 -mt-1 -ml-1"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-brand-500 -mt-1 -mr-1"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-brand-500 -mb-1 -ml-1"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-brand-500 -mb-1 -mr-1"></div>
                        </div>
                        <span className="material-icons-round text-6xl text-white/20">
                          videocam_off
                        </span>
                        <p className="absolute bottom-10 text-[10px] text-white/40 font-bold uppercase tracking-widest z-20">
                          Camera Engine Offline
                        </p>
                      </div>

                      <div className="mt-6 relative">
                        <span className="material-icons-round absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                          search
                        </span>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari Nama / ID Peserta..."
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-brand-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: LIST PESERTA */}
                  <div className="lg:col-span-7 space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                    <div className="flex items-center justify-between px-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Antrean Peserta ({filteredParticipants.length})
                      </h5>
                      <div className="flex items-center gap-4 text-[10px] font-bold">
                        <span className="text-emerald-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>{" "}
                          Hadir: {attendedCount}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>{" "}
                          Sisa: {totalSelected - attendedCount}
                        </span>
                      </div>
                    </div>

                    {filteredParticipants.length > 0 ? (
                      filteredParticipants.map((p) => (
                        <div
                          key={p.id}
                          className={`p-4 rounded-[1.5rem] border bg-white flex items-center justify-between transition-all group ${p.status === "attended" ? "border-emerald-100 opacity-70" : "border-slate-100 hover:border-brand-200 shadow-sm"}`}
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${p.status === "attended" ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-300"}`}
                            >
                              <span className="material-icons-round">
                                {p.status === "attended"
                                  ? "verified_user"
                                  : "person_outline"}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-dark leading-tight">
                                {p.name}
                              </h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                ID: {p.id} • {p.event}
                              </p>
                            </div>
                          </div>
                          {p.status === "attended" ? (
                            <div className="flex flex-col items-end pr-2">
                              <span className="text-emerald-600 font-black text-[9px] uppercase italic">
                                Checked In
                              </span>
                              <span className="text-[8px] font-bold text-slate-400">
                                10:45 AM
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => markAsPresent(p.id)}
                              className="h-10 px-6 bg-dark text-white text-[10px] font-black rounded-xl hover:bg-emerald-600 transition-all uppercase tracking-widest"
                            >
                              Check-In
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                        <p className="text-sm font-bold text-slate-400 italic">
                          Tidak ada peserta yang cocok
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-32 bg-white rounded-[3rem] border border-slate-100 text-center space-y-6">
                  <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto border-8 border-white shadow-inner">
                    <span className="material-icons-round text-5xl">
                      lock_open
                    </span>
                  </div>
                  <div className="max-w-xs mx-auto space-y-2">
                    <h4 className="text-xl font-black text-dark tracking-tight">
                      Security Checkpoint
                    </h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Sistem scanner sedang dalam mode standby. Silakan pilih
                      event dan buka gerbang untuk memulai.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      {/* --- 5. MODUL PENGELOLAAN SERTIFIKAT --- */}
      {activeTab === "certificates" && (
        <div className="animate-in fade-in duration-500 space-y-8">
          {/* HEADER & ACTIONS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <div>
              <h3 className="text-sm font-black text-dark uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Penerbitan Sertifikat
              </h3>
              <p className="text-[11px] font-bold text-slate-400 mt-1">
                Upload dan kirim sertifikat digital ke email peserta.
              </p>
            </div>
          </div>

          {/* FILTER ACARA */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div
              onClick={() => setSelectedEventFilter("all")}
              className={`min-w-[120px] p-4 rounded-3xl cursor-pointer transition-all border-2 flex flex-col items-center justify-center gap-1 ${
                selectedEventFilter === "all"
                  ? "border-brand-500 bg-brand-50 text-brand-600"
                  : "border-slate-100 bg-white text-slate-400"
              }`}
            >
              <span className="material-icons-round text-lg">apps</span>
              <span className="text-[9px] font-black uppercase">Semua</span>
            </div>

            {[...new Set(transactions.map((t) => t.event))].map((eventName) => (
              <div
                key={eventName}
                onClick={() => setSelectedEventFilter(eventName)}
                className={`min-w-[180px] p-4 rounded-3xl cursor-pointer transition-all border-2 flex items-center gap-3 ${
                  selectedEventFilter === eventName
                    ? "border-brand-500 bg-brand-50 shadow-sm"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedEventFilter === eventName ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-400"}`}
                >
                  <span className="material-icons-round text-sm">
                    workspace_premium
                  </span>
                </div>
                <span
                  className={`text-[10px] font-black uppercase truncate ${selectedEventFilter === eventName ? "text-brand-600" : "text-dark"}`}
                >
                  {eventName}
                </span>
              </div>
            ))}
          </div>

          {/* DAFTAR PESERTA */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">Nama Peserta</th>
                  <th className="px-8 py-6">Email / WhatsApp</th>
                  <th className="px-8 py-6 text-center">Status Kirim</th>
                  <th className="px-8 py-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions
                  .filter(
                    (t) =>
                      selectedEventFilter === "all" ||
                      t.event === selectedEventFilter,
                  )
                  .map((t) => (
                    <tr
                      key={t.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                            {t.user.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-dark text-sm leading-none mb-1">
                              {t.user}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                              {t.event}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                            <span className="material-icons-round text-[12px]">
                              mail
                            </span>{" "}
                            {t.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {t.id % 2 === 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black tracking-widest uppercase">
                            <span className="material-icons-round text-[12px]">
                              check
                            </span>{" "}
                            Terkirim
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[9px] font-black tracking-widest uppercase">
                            <span className="material-icons-round text-[12px]">
                              history
                            </span>{" "}
                            Menunggu
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Tombol yang memicu modal Drag & Drop */}
                          <button
                            onClick={() => setSelectedParticipantForCert(t)}
                            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-brand-600/20 hover:scale-105 transition-all flex items-center gap-2"
                          >
                            <span className="material-icons-round text-sm">
                              upload_file
                            </span>
                            Kirim Sertif
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* MODAL DRAG & DROP UPLOAD */}
          {selectedParticipantForCert && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div
                className="absolute inset-0 bg-dark/40 backdrop-blur-md"
                onClick={() => setSelectedParticipantForCert(null)}
              ></div>

              <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
                <button
                  onClick={() => setSelectedParticipantForCert(null)}
                  className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <span className="material-icons-round">close</span>
                </button>

                <div className="text-center space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-dark tracking-tight">
                      Upload Sertifikat
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Kirim untuk{" "}
                      <span className="text-brand-600 font-bold">
                        {selectedParticipantForCert.user}
                      </span>
                    </p>
                  </div>

                  {/* DROPZONE AREA */}
                  <div className="group relative">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 cursor-pointer hover:bg-brand-50 hover:border-brand-300 transition-all group-hover:scale-[1.02]">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-brand-500 transition-colors mb-4">
                          <span className="material-icons-round text-3xl">
                            cloud_upload
                          </span>
                        </div>
                        <p className="text-[11px] font-black text-dark uppercase tracking-widest">
                          Tarik file ke sini
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1">
                          atau klik untuk memilih file (PDF/JPG)
                        </p>
                      </div>
                      <input type="file" className="hidden" />
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setSelectedParticipantForCert(null)}
                      className="flex-1 py-4 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        alert("Sertifikat berhasil dikirim!");
                        setSelectedParticipantForCert(null);
                      }}
                      className="flex-1 py-4 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-brand-500/20 hover:bg-dark transition-all"
                    >
                      Kirim Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
