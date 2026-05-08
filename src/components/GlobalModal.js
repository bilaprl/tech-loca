"use client";
import { useState } from "react";

export default function GlobalModal({ event, onClose }) {
  const [showMap, setShowMap] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleBooking = () => {
    // Jika sudah sukses, anggap ini tombol untuk menuju Dashboard/E-Ticket
    if (bookingSuccess) {
      onClose(); // Di aplikasi nyata, ini bisa router.push('/dashboard')
      return;
    }

    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);

      // Native Notification Logic
      if (
        typeof window !== "undefined" &&
        Notification.permission === "granted"
      ) {
        new Notification("Booking Berhasil!", {
          body: `E-Ticket untuk ${event.title} sudah tersedia di dashboard.`,
          icon: "/logo.png",
        });
      }
    }, 1500);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (!event) return null;

  const isFull = event.quota === 0;

  return (
    <div className="fixed inset-0 z-[200] bg-dark/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Overlay klik luar untuk tutup */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-in zoom-in-95 duration-300">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-dark rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-icons-round">close</span>
        </button>

        {/* --- Media Side (Gambar / Peta) --- */}
        <div className="md:w-[45%] h-64 md:h-auto bg-slate-200 relative overflow-hidden group">
          {!showMap ? (
            <>
              <img
                src={event.img}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Poster"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent"></div>
            </>
          ) : (
            <div className="w-full h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.2403780365773!2d108.2199516!3d-7.326848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f575c328dbbd1%3A0xc6222b467ec6cc76!2sSiliwangi%20University!5e0!3m2!1sen!2sid!4v1699999999999"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>
          )}

          {/* Badge Kategori Kiri Atas */}
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-bold text-brand-600 shadow-sm uppercase tracking-wider">
            {event.category}
          </div>

          {/* Tombol Toggle Peta Kiri Bawah */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="absolute bottom-6 left-6 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <span className="material-icons-round text-base">
              {showMap ? "image" : "map"}
            </span>
            {showMap ? "Lihat Poster" : "Lihat Lokasi Peta"}
          </button>
        </div>

        {/* --- Content Side --- */}
        <div className="md:w-[55%] p-8 lg:p-10 flex flex-col bg-white overflow-y-auto">
          {/* Header Info: Title & Wishlist */}
          <div className="flex justify-between items-start gap-4 mb-4 mt-4 md:mt-0">
            <h2 className="font-heading text-3xl lg:text-4xl font-extrabold text-dark leading-tight">
              {event.title}
            </h2>
            <button
              onClick={toggleWishlist}
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border 
                ${
                  isWishlisted
                    ? "bg-rose-50 border-rose-200 text-rose-500 shadow-inner"
                    : "bg-white border-slate-200 text-slate-400 hover:border-brand-500 hover:text-brand-500 hover:bg-brand-50 shadow-sm"
                }`}
              title={
                isWishlisted ? "Hapus dari Wishlist" : "Simpan ke Wishlist"
              }
            >
              <span className="material-icons-round text-2xl">
                {isWishlisted ? "favorite" : "favorite_border"}
              </span>
            </button>
          </div>

          {/* Penyelenggara (EO) */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
              <span className="material-icons-round">verified</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Diselenggarakan Oleh
              </p>
              <p className="text-sm font-bold text-dark">{event.eo}</p>
            </div>
          </div>

          {/* Info Grid (Bento Box Style) */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3 items-center">
              <span className="material-icons-round text-brand-500 bg-white p-2 rounded-xl shadow-sm">
                calendar_month
              </span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Tanggal
                </p>
                <p className="text-sm font-bold text-dark">{event.date}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3 items-center">
              <span className="material-icons-round text-rose-500 bg-white p-2 rounded-xl shadow-sm">
                schedule
              </span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Waktu
                </p>
                <p className="text-sm font-bold text-dark">{event.time}</p>
              </div>
            </div>
            <div className="col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3 items-center">
              <span className="material-icons-round text-emerald-500 bg-white p-2 rounded-xl shadow-sm">
                location_on
              </span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Lokasi Acara
                </p>
                <p className="text-sm font-bold text-dark">
                  {event.venue}, {event.location}
                </p>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-dark mb-2 flex items-center gap-2">
              <span className="material-icons-round text-slate-400 text-sm">
                info
              </span>{" "}
              Tentang Acara
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {event.desc}
            </p>
          </div>

          {/* --- Action Bar (Bottom) --- */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Ketersediaan Tiket
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider 
                ${isFull ? "bg-rose-100 text-rose-600" : "bg-brand-100 text-brand-600"}`}
              >
                {isFull ? "Habis Terjual" : `${event.quota} Kursi Tersedia`}
              </span>
            </div>

            <button
              disabled={isFull && !bookingSuccess}
              onClick={handleBooking}
              className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg 
                ${
                  bookingSuccess
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30" // State Berhasil -> Lihat Tiket
                    : isFull
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" // State Penuh
                      : "bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/30" // State Normal
                }`}
            >
              {isBooking ? (
                <>
                  <div className="spinner"></div> Memproses...
                </>
              ) : bookingSuccess ? (
                <>
                  <span className="material-icons-round">local_activity</span>{" "}
                  Lihat E-Ticket Saya
                </>
              ) : isFull ? (
                <>
                  <span className="material-icons-round">block</span> Kuota
                  Penuh
                </>
              ) : (
                <>
                  <span className="material-icons-round">
                    check_circle_outline
                  </span>{" "}
                  Amankan Slot Sekarang
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
