"use client";
import { useState, useMemo } from "react";
import { eventsData } from "@/data/events";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

// Helper untuk mengubah string tanggal Indonesia ke Date object
const parseIndonesianDate = (dateStr) => {
  const months = {
    Januari: 0,
    Februari: 1,
    Maret: 2,
    April: 3,
    Mei: 4,
    Juni: 5,
    Juli: 6,
    Agustus: 7,
    September: 8,
    Oktober: 9,
    November: 10,
    Desember: 11,
  };
  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    return new Date(parts[2], months[parts[1]], parts[0]);
  }
  return new Date();
};

export default function MyTickets({ onOpenModal }) {
  // Simulasi Database Tiket Lokal (CRUD State)
  // Status: 'pending' (belum bayar), 'confirmed' (lunas), 'attended' (sudah discan EO)
  const [myTickets, setMyTickets] = useState([
    {
      id: 101,
      eventId: 1,
      status: "confirmed",
      bookingDate: "08 Mei 2026",
      qrData: "TL-CONF-101-ABC",
    },
    {
      id: 102,
      eventId: 2,
      status: "pending",
      bookingDate: "08 Mei 2026",
      qrData: "",
    },
    {
      id: 103,
      eventId: 4,
      status: "confirmed",
      bookingDate: "07 Mei 2026",
      qrData: "TL-CONF-103-XYZ",
    },
  ]);

  const [activeTab, setActiveTab] = useState("active");
  // STATE BARU: Untuk filter sub-kategori di Tiket Aktif
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'pending', 'confirmed'

  // --- CRUD FUNCTIONS ---

  // 1. DELETE: Batalkan pesanan
  const handleCancelTicket = (e, ticketId) => {
    e.stopPropagation();
    if (confirm("Yakin ingin membatalkan pesanan tiket ini?")) {
      setMyTickets((prev) => prev.filter((t) => t.id !== ticketId));
    }
  };

  // 2. UPDATE: Lanjutkan Transaksi (Arahkan ke WhatsApp)
  const handleContinuePayment = (e, eventTitle) => {
    e.stopPropagation();
    const adminWA = "6281234567890"; // Ganti nomor WA Admin
    const text = encodeURIComponent(
      `Halo Admin TechLoca, saya ingin melanjutkan proses pembayaran untuk acara: *${eventTitle}*. Mohon panduannya.`,
    );
    window.open(`https://wa.me/${adminWA}?text=${text}`, "_blank");
  };

  // 3. UPDATE: Simulasi Check-in oleh EO (Ubah status ke attended)
  const handleSimulateEOScan = (e, ticketId) => {
    e.stopPropagation();
    alert("BIP! Tiket berhasil di-scan oleh EO. Selamat mengikuti acara!");
    setMyTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "attended" } : t)),
    );
  };

  // Unduh PDF Nyata (Screenshot DOM Menggunakan html-to-image)
  const handleDownloadPDF = async (e, eventTitle, ticketId) => {
    e.stopPropagation();

    const ticketElement = document.getElementById(`ticket-card-${ticketId}`);
    if (!ticketElement) return;

    try {
      const btn = e.currentTarget;
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span class="material-icons-round text-sm animate-spin">sync</span> Memproses...`;

      // Ekstrak dimensi asli dari elemen tiket
      const width = ticketElement.offsetWidth;
      const height = ticketElement.offsetHeight;

      // Konversi DOM menjadi Data URL PNG
      const dataUrl = await toPng(ticketElement, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2, // Resolusi tinggi (HD)
        fontEmbedCSS: "", // <--- SOLUSI ERROR CORS: Bypass pembacaan CSS font eksternal
      });

      // Buat file PDF berdasarkan ukuran elemen
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [width, height],
      });

      // Masukkan gambar ke PDF dan simpan
      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save(`E-Ticket_TechLoca_${eventTitle.replace(/\s+/g, "_")}.pdf`);

      btn.innerHTML = originalText;
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert(
        "Maaf, terjadi kendala teknis saat merender PDF. Pastikan koneksi stabil.",
      );
    }
  };

  // --- LOGIKA FILTER (READ & AUTO-UPDATE EXPIRED) ---
  const { activeTickets, historyTickets } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const active = [];
    const history = [];

    myTickets.forEach((ticket) => {
      // Cari data event aslinya
      const eventInfo = eventsData.find((ev) => ev.id === ticket.eventId);
      if (!eventInfo) return;

      const eventDate = parseIndonesianDate(eventInfo.date);
      const isPast = eventDate < today;

      // Gabungkan data tiket dengan data event
      const fullTicketData = { ...ticket, event: eventInfo, isPast };

      // Logika Pemisahan Tab:
      // Masuk History JIKA: Sudah terlewat (isPast) ATAU statusnya sudah dihadiri (attended)
      if (isPast || ticket.status === "attended") {
        history.push(fullTicketData);
      } else {
        // Jika masih akan datang dan belum dihadiri
        active.push(fullTicketData);
      }
    });

    return { activeTickets: active, historyTickets: history };
  }, [myTickets]);

  // LOGIKA BARU: Terapkan sub-filter jika sedang di tab aktif
  let displayedTickets =
    activeTab === "active" ? activeTickets : historyTickets;

  if (activeTab === "active" && activeFilter !== "all") {
    displayedTickets = displayedTickets.filter(
      (ticket) => ticket.status === activeFilter,
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-dark mb-4 tracking-tight">
          E-Ticket{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
            Saya
          </span>
        </h1>
        <p className="text-slate-500 font-medium">
          Kelola tiket acaramu, selesaikan pembayaran, dan tunjukkan QR Code
          saat di lokasi.
        </p>
      </div>

      {/* TAB NAVIGATION MAIN */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-px">
        <button
          onClick={() => {
            setActiveTab("active");
            setActiveFilter("all"); // Reset filter saat pindah tab
          }}
          className={`relative px-6 py-3 text-sm font-bold transition-colors ${
            activeTab === "active"
              ? "text-brand-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Tiket Aktif ({activeTickets.length})
          {activeTab === "active" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4F46E5] rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`relative px-6 py-3 text-sm font-bold transition-colors ${
            activeTab === "history"
              ? "text-slate-800"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Riwayat ({historyTickets.length})
          {activeTab === "history" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-800 rounded-t-full"></span>
          )}
        </button>
      </div>

      {/* --- SUB-FILTER (Hanya Muncul di Tiket Aktif) --- */}
      {activeTab === "active" && activeTickets.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all ${
              activeFilter === "all"
                ? "bg-[#4F46E5] text-white shadow-md shadow-brand-600/20"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all flex items-center gap-1.5 ${
              activeFilter === "pending"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "bg-amber-50 text-amber-600 hover:bg-amber-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
            Menunggu Pembayaran
          </button>
          <button
            onClick={() => setActiveFilter("confirmed")}
            className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all flex items-center gap-1.5 ${
              activeFilter === "confirmed"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
            Terkonfirmasi
          </button>
        </div>
      )}

      {/* TICKET LIST */}
      {displayedTickets.length > 0 ? (
        <div className="flex flex-col gap-8">
          {displayedTickets.map((ticket) => {
            const ev = ticket.event;
            const isPending = ticket.status === "pending";
            const isAttended = ticket.status === "attended";
            const isExpired = ticket.isPast && ticket.status !== "attended";

            return (
              <div
                key={ticket.id}
                id={`ticket-card-${ticket.id}`} // <--- ID UNTUK HTML-TO-IMAGE
                onClick={() => onOpenModal(ev)}
                className={`bg-white rounded-[2rem] border border-slate-200 flex flex-col lg:flex-row overflow-hidden transition-all duration-300 cursor-pointer relative group
                  ${activeTab === "active" ? "hover:shadow-2xl hover:-translate-y-1 hover:border-brand-200" : "opacity-80 grayscale-[20%]"}`}
              >
                {/* --- BAGIAN KIRI: Cover Gambar --- */}
                <div className="lg:w-1/3 h-48 lg:h-auto relative overflow-hidden">
                  <img
                    src={ev.img}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-dark/20"></div>

                  {/* Status Badge Dinamis */}
                  <div
                    className={`absolute top-4 left-4 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm backdrop-blur-md
                    ${
                      isPending
                        ? "bg-amber-500 text-white"
                        : isAttended
                          ? "bg-slate-700 text-white"
                          : isExpired
                            ? "bg-rose-500 text-white"
                            : "bg-emerald-500 text-white"
                    }`}
                  >
                    {isPending
                      ? "Menunggu Pembayaran"
                      : isAttended
                        ? "Telah Digunakan"
                        : isExpired
                          ? "Kadaluarsa"
                          : "Confirmed"}
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-dark text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    Order ID: #{ticket.id}
                  </div>
                </div>

                {/* --- GARIS POTONG TIKET (Tear-off line) --- */}
                <div className="hidden lg:flex flex-col items-center justify-between relative bg-white w-6">
                  <div className="w-8 h-8 rounded-full bg-slate-50 absolute -top-4 border-b border-slate-200 shadow-inner"></div>
                  <div className="h-full border-r-2 border-dashed border-slate-200 my-6"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 absolute -bottom-4 border-t border-slate-200 shadow-inner"></div>
                </div>

                {/* --- BAGIAN TENGAH: Info Acara --- */}
                <div className="p-6 lg:p-8 flex-grow flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                      {ev.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Dipesan pada {ticket.bookingDate}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-dark mb-6 leading-tight group-hover:text-brand-600 transition-colors">
                    {ev.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div>
                      <p className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                        <span className="material-icons-round text-sm text-brand-500">
                          schedule
                        </span>{" "}
                        Waktu
                      </p>
                      <p className="text-sm font-bold text-dark">{ev.date}</p>
                      <p className="text-xs font-semibold text-slate-500">
                        {ev.time}
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                        <span className="material-icons-round text-sm text-emerald-500">
                          location_on
                        </span>{" "}
                        Lokasi
                      </p>
                      <p className="text-sm font-bold text-dark truncate">
                        {ev.venue}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {ev.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- BAGIAN KANAN: Aksi & QR Code --- */}
                <div className="bg-slate-50 p-6 lg:p-8 lg:w-64 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-200 border-dashed relative z-10">
                  {isPending ? (
                    // AKSI: JIKA MASIH PENDING (Menunggu Pembayaran)
                    <div className="text-center w-full">
                      <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons-round text-3xl">
                          account_balance_wallet
                        </span>
                      </div>
                      <p className="text-xs font-bold text-dark mb-4">
                        Selesaikan pembayaran untuk mendapatkan QR Code.
                      </p>
                      <button
                        onClick={(e) => handleContinuePayment(e, ev.title)}
                        className="w-full bg-[#4F46E5] hover:bg-brand-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mb-3"
                      >
                        <span className="material-icons-round text-sm">
                          chat
                        </span>{" "}
                        Lanjut ke WA
                      </button>
                      <button
                        onClick={(e) => handleCancelTicket(e, ticket.id)}
                        className="text-[11px] font-bold text-rose-500 hover:text-rose-600 hover:underline"
                      >
                        Batalkan Pesanan
                      </button>
                    </div>
                  ) : activeTab === "history" ? (
                    // AKSI: JIKA MASIH DI HISTORY (Sudah hadir / Kadaluarsa)
                    <div className="text-center w-full">
                      <div className="w-20 h-20 border-4 border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 rotate-12 opacity-50">
                        <span className="font-heading font-black text-slate-300 text-xl tracking-widest uppercase">
                          {isAttended ? "USED" : "EXPIRED"}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400">
                        {isAttended
                          ? "Kamu telah mengikuti acara ini."
                          : "Waktu acara telah terlewat."}
                      </p>
                    </div>
                  ) : (
                    // AKSI: JIKA CONFIRMED (Siap digunakan - TAMPILKAN QR CODE)
                    <div className="text-center w-full">
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-3 inline-block">
                        {/* INI ADALAH KOMPONEN QR CODE NYA */}
                        <QRCodeSVG
                          value={ticket.qrData}
                          size={96}
                          bgColor={"#ffffff"}
                          fgColor={"#0F172A"}
                          level={"H"}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest text-center mb-4">
                        Scan Masuk Area
                      </p>
                      <button
                        onClick={(e) =>
                          handleDownloadPDF(e, ev.title, ticket.id)
                        } // <--- PARAMETER ID
                        className="w-full bg-dark hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-2"
                      >
                        <span className="material-icons-round text-sm">
                          download
                        </span>{" "}
                        Unduh PDF
                      </button>

                      {/* SIMULASI EO SCAN - Tombol Rahasia untuk Demo */}
                      <button
                        onClick={(e) => handleSimulateEOScan(e, ticket.id)}
                        className="text-[9px] font-bold text-slate-400 hover:text-brand-500 transition-colors uppercase tracking-widest"
                      >
                        [Simulasi Scan EO]
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-slate-300">
            <span className="material-icons-round text-5xl">
              {activeTab === "active" ? "local_activity" : "history"}
            </span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-dark mb-2">
            {activeTab === "active"
              ? activeFilter !== "all"
                ? `Tidak ada tiket ${activeFilter === "pending" ? "menunggu pembayaran" : "terkonfirmasi"}`
                : "Belum Ada Tiket Aktif"
              : "Riwayat Masih Kosong"}
          </h3>
          <p className="text-slate-500 text-sm max-w-sm">
            {activeTab === "active"
              ? activeFilter !== "all"
                ? "Saat ini kamu tidak memiliki tiket dengan status tersebut."
                : "Kamu belum mengamankan slot untuk acara apapun. Yuk cari event menarik sekarang!"
              : "Tiket acara yang sudah kamu ikuti atau tanggalnya terlewat akan muncul di sini."}
          </p>
          {activeTab === "active" && activeFilter === "all" && (
            <button
              onClick={() => onOpenModal(null)} // Di page.js ubah ini jadi panggil navigasi ke explore jika null
              className="mt-6 px-6 py-3 bg-[#4F46E5] text-white font-bold rounded-xl hover:bg-brand-500 transition-colors"
            >
              Cari Workshop
            </button>
          )}
        </div>
      )}
    </div>
  );
}
