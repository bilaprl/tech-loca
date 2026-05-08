"use client";
import { useState } from "react";

export default function Profile() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-dark mb-4 tracking-tight">
          Pengaturan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
            Profil
          </span>
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          Kelola informasi data dirimu dan preferensi akun TechLoca.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* --- KOLOM KIRI: Kartu Profil Premium --- */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group">
            {/* Banner Latar Belakang */}
            <div className="h-32 bg-gradient-to-r from-brand-500 via-indigo-400 to-rose-400 relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
              {/* Tombol Edit Banner */}
              <button className="absolute top-4 right-4 w-8 h-8 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
                <span className="material-icons-round text-sm">edit</span>
              </button>
            </div>

            <div className="px-8 pb-8 flex flex-col items-center relative text-center">
              {/* Avatar dengan Efek Overlap */}
              <div className="relative cursor-pointer mb-5 -mt-16">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <img
                    src="https://i.pravatar.cc/150?u=nabila"
                    alt="Avatar"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="material-icons-round text-white text-3xl drop-shadow-md">
                      photo_camera
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="font-heading text-2xl font-extrabold text-dark leading-tight">
                Nabila Aprilianti Nuravifah
              </h2>
              <div className="flex items-center gap-2 mt-2 mb-5">
                <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-brand-100">
                  Member
                </span>
                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                  Tech Enthusiast
                </span>
              </div>

              <div className="w-full pt-6 border-t border-slate-100 space-y-3 text-left">
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="material-icons-round text-lg text-slate-400">
                    school
                  </span>
                  <span className="text-sm font-semibold truncate">
                    Universitas Siliwangi
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="material-icons-round text-lg text-brand-500">
                    location_on
                  </span>
                  <span className="text-sm font-semibold truncate">
                    Tasikmalaya, Jawa Barat
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="material-icons-round text-lg text-slate-400">
                    calendar_month
                  </span>
                  <span className="text-sm font-semibold">
                    Bergabung Mei 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: Form Edit Profil --- */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm">
          <h3 className="font-heading text-2xl font-bold text-dark mb-8 flex items-center gap-3">
            <span className="material-icons-round text-brand-500">
              manage_accounts
            </span>{" "}
            Informasi Dasar
          </h3>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field Nama */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 ml-1">
                  Nama Lengkap
                </label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    person
                  </span>
                  <input
                    type="text"
                    defaultValue="Nabila Aprilianti Nuravifah"
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-bold text-dark"
                  />
                </div>
              </div>

              {/* Field Email */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    alternate_email
                  </span>
                  <input
                    type="email"
                    defaultValue="nabila@unsil.ac.id"
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-bold text-dark"
                  />
                </div>
              </div>

              {/* Field Telepon */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 ml-1">
                  Nomor WhatsApp
                </label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    call
                  </span>
                  <input
                    type="tel"
                    defaultValue="081234567890"
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-bold text-dark"
                  />
                </div>
              </div>

              {/* Field Institusi */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 ml-1">
                  Institusi / Universitas
                </label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    business
                  </span>
                  <input
                    type="text"
                    defaultValue="Universitas Siliwangi"
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-bold text-dark"
                  />
                </div>
              </div>

              {/* Field LOKASI (Baru Ditambahkan) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 ml-1">
                  Lokasi / Domisili Saat Ini
                </label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    location_city
                  </span>
                  <input
                    type="text"
                    defaultValue="Tasikmalaya"
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-bold text-dark"
                    placeholder="Contoh: Bandung, Jakarta Selatan..."
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 ml-1">
                  *Lokasi ini akan digunakan untuk merekomendasikan event
                  terdekat denganmu.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h3 className="font-heading text-xl font-bold text-dark mb-6 flex items-center gap-3">
                <span className="material-icons-round text-brand-500">
                  lock
                </span>{" "}
                Keamanan Akun
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 ml-1">
                  Ubah Password Baru (Opsional)
                </label>
                <div className="relative group">
                  <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-sm font-bold text-dark placeholder-slate-300"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 ml-1">
                  Biarkan kosong jika tidak ingin mengubah kata sandi saat ini.
                </p>
              </div>
            </div>

            <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                type="button"
                className="px-8 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-dark transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg min-w-[200px]
                  ${isSuccess ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/30"}`}
              >
                {isSaving ? (
                  <>
                    <div className="spinner"></div> Menyimpan...
                  </>
                ) : isSuccess ? (
                  <>
                    <span className="material-icons-round">check_circle</span>{" "}
                    Berhasil Disimpan
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
