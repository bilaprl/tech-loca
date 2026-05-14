import 'package:flutter/material.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Data dummy notifikasi untuk simulasi
    final List<Map<String, String>> notifications = [
      {
        "title": "Sertifikat Terbit! 🎓",
        "desc": "Sertifikat UI/UX Masterclass kamu sudah tersedia.",
        "time": "2 menit yang lalu",
        "type": "cert",
      },
      {
        "title": "Pembayaran Berhasil ✅",
        "desc": "Tiket Web Dev Unsil sudah aktif di menu Tiket.",
        "time": "1 jam yang lalu",
        "type": "ticket",
      },
      {
        "title": "Reminder Acara ⏰",
        "desc": "Event UI/UX dimulai besok jam 09:00 WIB.",
        "time": "5 jam yang lalu",
        "type": "event",
      },
      {
        "title": "Selamat Datang! 👋",
        "desc": "Terima kasih telah bergabung di TechLoca.",
        "time": "1 hari yang lalu",
        "type": "info",
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          "Notifikasi",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      body: notifications.isEmpty
          ? _buildEmptyState()
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: notifications.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final item = notifications[index];
                return _buildNotificationCard(item);
              },
            ),
    );
  }

  Widget _buildNotificationCard(Map<String, String> item) {
    IconData icon;
    Color color;

    // Logika pemilihan ikon berdasarkan tipe
    switch (item['type']) {
      case 'cert':
        icon = Icons.card_membership_rounded;
        color = Colors.purple;
        break;
      case 'ticket':
        icon = Icons.confirmation_number_rounded;
        color = Colors.green;
        break;
      case 'event':
        icon = Icons.event_available_rounded;
        color = Colors.orange;
        break;
      default:
        icon = Icons.notifications_active_rounded;
        color = const Color(0xFF4F46E5);
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item['title']!,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  item['desc']!,
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                ),
                const SizedBox(height: 8),
                Text(
                  item['time']!,
                  style: TextStyle(color: Colors.grey.shade400, fontSize: 11),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none_rounded,
            size: 80,
            color: Colors.grey.shade300,
          ),
          const SizedBox(height: 16),
          const Text(
            "Belum ada notifikasi",
            style: TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
