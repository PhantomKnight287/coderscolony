// ignore_for_file: use_build_context_synchronously
import 'dart:convert';
import 'package:application/constants/urls.dart';
import 'package:application/controllers/user.dart';
import 'package:application/screens/auth/login.dart';
import 'package:application/screens/profile/main.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import "package:http/http.dart" as http;

void main() async {
  await dotenv.load(fileName: ".env");
  runApp(MaterialApp(
    title: 'Coders Colony',
    theme: ThemeData.dark(),
    darkTheme: ThemeData.dark(),
    home: const Entry(),
    debugShowCheckedModeBanner: false,
  ));
}

class Entry extends StatefulWidget {
  const Entry({super.key});

  @override
  State<Entry> createState() => _EntryState();
}

class _EntryState extends State<Entry> {
  final UserController c = Get.put(UserController());
  void verify() {
    Future<SharedPreferences> storage = SharedPreferences.getInstance();
    storage.then((SharedPreferences storage) async {
      if (storage.getString("token") == null) return;
      http.Response res = await http.get(Uri.parse("$API_URL/auth/hydrate"), headers: {
        "authorization": "Bearer ${storage.getString("token")}",
      });
      final data = jsonDecode(res.body);
      if (res.statusCode != 200 && res.statusCode != 201) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(data["message"]),
        ));
      } else {
        c.bulkUpdate({
          "token": storage.getString("token"),
          "id": data["id"],
          "name": data["name"],
          "username": data["username"],
          "profile": data["profileImage"],
        });
        setState(() {});
      }
    });
  }

  @override
  void initState() {
    super.initState();
    verify();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: ListView(
          children: [
            const DrawerHeader(
              child: Text('Coders Colony'),
            ),
            ListTile(
              title: const Text('Logout'),
              onTap: () {
                c.clear();
                Future<SharedPreferences> storage = SharedPreferences.getInstance();
                storage.then((SharedPreferences storage) async {
                  await storage.clear();
                });
                setState(() {});
                Navigator.pop(context);
              },
            )
          ],
        ),
      ),
      appBar: AppBar(
        actions: [
          IconButton(
              icon: c.profile.value != ""
                  ? CircleAvatar(
                      backgroundImage: NetworkImage("$STORAGE_URL/${c.profile.value}"),
                    )
                  : const Icon(Icons.person),
              onPressed: () {
                if (c.profile.value != "") {
                  Navigator.push(context, CupertinoPageRoute(builder: (context) {
                    return const ProfileScreen();
                  }));
                } else {
                  Navigator.push(context, CupertinoPageRoute(builder: (context) {
                    return const LoginScreen();
                  })).then(
                    (value) {
                      verify();
                    },
                  );
                }
              })
        ],
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Text('Hello World'),
      ),
      backgroundColor: Colors.black,
    );
  }
}
