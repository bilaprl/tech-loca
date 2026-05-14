import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/splash_screen.dart';
import 'screens/home_screen.dart';
import 'screens/explore_screen.dart';
import 'screens/tickets_screen.dart';
import 'screens/profile_screen.dart';
import 'admin/admin_dashboard_screen.dart';
import 'package:mobile/services/notification_service.dart';
import 'services/ticket_service.dart';

void main() async {
  // 1. WAJIB: Pastikan sistem Flutter siap sebelum inisialisasi Supabase
  WidgetsFlutterBinding.ensureInitialized();

  await NotificationService.init();
  await TicketService.init();

  runApp(const MyApp());

  // 2. Inisialisasi Supabase dengan data dari temanmu
  await Supabase.initialize(
    url: 'https://cgyhcgneljqmmcwsravj.supabase.co',
    anonKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNneWhjZ25lbGpxbW1jd3NyYXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NDMxNTUsImV4cCI6MjA5NDAxOTE1NX0.zgs6DROpp5brUe_4YIqpUn6DqmfIVLRE2S11LUZ_ITw',
  );

  runApp(const TechLocaApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'TechLoca',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF6366F1),
      ),
      // Ganti 'Container()' dengan halaman login atau dashboard admin kamu
      home: const AdminDashboardScreen(),
    );
  }
}

// REMOTE CONTROL UNTUK PINDAH TAB
final GlobalKey<MainNavigationState> mainNavKey =
    GlobalKey<MainNavigationState>();

class TechLocaApp extends StatelessWidget {
  const TechLocaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TechLoca',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF4F46E5)),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        useMaterial3: true,
        fontFamily: 'Montserrat',
      ),
      home: const SplashScreen(),
    );
  }
}

class MainNavigation extends StatefulWidget {
  static MainNavigationState? of(BuildContext context) {
    return context.findAncestorStateOfType<MainNavigationState>();
  }

  MainNavigation({Key? key}) : super(key: key ?? mainNavKey);

  @override
  State<MainNavigation> createState() => MainNavigationState();
}

class MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;

  void changeTab(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          HomeScreen(),
          ExploreScreen(),
          TicketsScreen(),
          ProfileScreen(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          changeTab(index);
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF4F46E5),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: "Home"),
          BottomNavigationBarItem(icon: Icon(Icons.explore), label: "Explore"),
          BottomNavigationBarItem(
            icon: Icon(Icons.confirmation_number),
            label: "Tickets",
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
        ],
      ),
    );
  }
}
