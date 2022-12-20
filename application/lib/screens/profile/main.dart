import 'dart:convert';
import 'package:application/res/profile.dart';
import 'package:google_fonts/google_fonts.dart';
import "package:shimmer/shimmer.dart";
import 'package:application/constants/color.dart';
import 'package:application/constants/urls.dart';
import 'package:application/controllers/user.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import "package:http/http.dart" as http;
import 'package:shared_preferences/shared_preferences.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final c = Get.find<UserController>();

  Future<dynamic> getProfile() async {
    final storage = await SharedPreferences.getInstance();
    final token = storage.getString("token");
    final res = await http.get(Uri.parse("$API_URL/profile/${c.username}"), headers: token != null ? {"authorization": "Bearer $token"} : null);
    return Future.delayed(const Duration(seconds: 2), () => res);
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      body: SafeArea(
        child: SingleChildScrollView(
          child: FutureBuilder(
            future: getProfile(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                final res = snapshot.data;

                if (res.statusCode == 200 || res.statusCode == 201) {
                  final body = Profile.fromJson(jsonDecode(res.body));
                  return Column(
                    children: [
                      if (body.bannerImage != null)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(5.0),
                          child: Image.network(
                            "$STORAGE_URL/${body.bannerImage}",
                            fit: BoxFit.fill,
                            loadingBuilder: (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
                              if (loadingProgress == null) return child;
                              return Center(
                                child: CircularProgressIndicator(
                                  value: loadingProgress.expectedTotalBytes != null ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes! : null,
                                ),
                              );
                            },
                          ),
                        )
                      else
                        Container(
                          height: 200,
                          width: double.infinity,
                          color: Color(int.parse(body.bannerColor)),
                        ),
                      const SizedBox(
                        height: 10.0,
                      ),
                      Row(
                        children: [
                          Padding(
                            padding: const EdgeInsets.fromLTRB(10, 0, 0, 0),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(80.0),
                              child: Image.network(
                                "$STORAGE_URL/${body.profileImage}",
                                fit: BoxFit.fill,
                                loadingBuilder: (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
                                  if (loadingProgress == null) return child;
                                  return Center(
                                    child: CircularProgressIndicator(
                                      value: loadingProgress.expectedTotalBytes != null ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes! : null,
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                          Flexible(
                            child: Padding(
                              padding: const EdgeInsets.fromLTRB(20, 0, 0, 0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    body.name,
                                    style: GoogleFonts.outfit(
                                      fontSize: 20.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(
                                    width: MediaQuery.of(context).size.width * 0.6,
                                    height: 8,
                                  ),
                                  Text(
                                    "@${body.username}",
                                    style: GoogleFonts.outfit(
                                      fontSize: 15.0,
                                      fontWeight: FontWeight.w300,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          )
                        ],
                      )
                    ],
                  );
                } else {
                  final body = jsonDecode(res.body);
                  return Text(body["message"]);
                }
              } else {
                return Shimmer.fromColors(
                    baseColor: Colors.grey.shade500,
                    highlightColor: Colors.grey.shade600,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        children: [
                          Container(
                            width: 100.0,
                            height: 100.0,
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 100.0),
                          Container(
                            width: double.infinity,
                            height: 50,
                            padding: const EdgeInsets.symmetric(horizontal: 10.0),
                            decoration: const BoxDecoration(
                              shape: BoxShape.rectangle,
                              color: Colors.white,
                              borderRadius: BorderRadius.all(Radius.circular(50.0)),
                            ),
                          ),
                          const SizedBox(height: 10.0),
                          Container(
                            width: double.infinity,
                            height: 50,
                            decoration: const BoxDecoration(
                              shape: BoxShape.rectangle,
                              color: Colors.white,
                              borderRadius: BorderRadius.all(Radius.circular(50.0)),
                            ),
                          ),
                          const SizedBox(height: 10.0),
                          Container(
                            width: double.infinity,
                            height: 50,
                            decoration: const BoxDecoration(
                              shape: BoxShape.rectangle,
                              color: Colors.white,
                              borderRadius: BorderRadius.all(Radius.circular(50.0)),
                            ),
                          ),
                          const SizedBox(height: 10.0),
                          Container(
                            width: double.infinity,
                            height: 50,
                            decoration: const BoxDecoration(
                              shape: BoxShape.rectangle,
                              color: Colors.white,
                              borderRadius: BorderRadius.all(Radius.circular(50.0)),
                            ),
                          ),
                          const SizedBox(height: 10.0),
                          Container(
                            width: double.infinity,
                            height: 50,
                            decoration: const BoxDecoration(
                              shape: BoxShape.rectangle,
                              color: Colors.white,
                              borderRadius: BorderRadius.all(Radius.circular(50.0)),
                            ),
                          ),
                          const SizedBox(height: 10.0),
                          Container(
                            width: double.infinity,
                            height: 50,
                            decoration: const BoxDecoration(
                              shape: BoxShape.rectangle,
                              color: Colors.white,
                              borderRadius: BorderRadius.all(Radius.circular(50.0)),
                            ),
                          ),
                          const SizedBox(height: 10.0),
                          Container(
                            width: double.infinity,
                            height: 50,
                            decoration: const BoxDecoration(
                              shape: BoxShape.rectangle,
                              color: Colors.white,
                              borderRadius: BorderRadius.all(Radius.circular(50.0)),
                            ),
                          ),
                        ],
                      ),
                    ));
              }
            },
          ),
        ),
      ),
      backgroundColor: MAIN,
    );
  }
}
