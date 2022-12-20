import 'dart:convert';
import 'package:application/constants/color.dart';
import 'package:application/constants/urls.dart';
import 'package:application/controllers/user.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import "package:shared_preferences/shared_preferences.dart";

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  var key = GlobalKey<FormState>();
  bool isPasswordVisible = false;

  void writeToken(String token) async {
    SharedPreferences storage = await SharedPreferences.getInstance();
    storage.setString("token", token);
  }

  final UserController c = Get.find();
  @override
  void dispose() {
    super.dispose();
    emailController.dispose();
    passwordController.dispose();
  }

  void login() {
    Future<http.Response> res = http.post(
      Uri.parse("$API_URL/auth/login"),
      body: jsonEncode({
        "email": emailController.text,
        "password": passwordController.text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    );
    res.then((http.Response response) {
      Map<String, dynamic> data = jsonDecode(response.body);
      if (response.statusCode != 200 && response.statusCode != 201) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(data["message"])));
      } else {
        c.bulkUpdate({
          "token": data["token"],
          "id": data["user"]["id"],
          "name": data["user"]["name"],
          "username": data["user"]["username"],
          "profile": data["user"]["profileImage"],
        });
        writeToken(data["token"]);
        Navigator.pop(context);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Container(
              padding: const EdgeInsets.all(20),
              width: double.infinity,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    'Welcome Back!',
                    style: GoogleFonts.outfit(
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(
                    height: 2,
                  ),
                  Wrap(
                    alignment: WrapAlignment.center,
                    runSpacing: 5.0,
                    spacing: 5.0,
                    children: [
                      Text(
                        "Do not have an account yet?",
                        style: GoogleFonts.outfit(
                          fontSize: 15,
                        ),
                      ),
                      GestureDetector(
                        onTap: () {},
                        child: Text(
                          'Create Account',
                          style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.blue),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  Form(
                    key: key,
                    child: Column(
                      children: [
                        Row(children: [
                          Text("Email",
                              style: GoogleFonts.outfit(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                              )),
                          Text("*", style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.red)),
                        ]),
                        const SizedBox(
                          height: 10,
                        ),
                        TextFormField(
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.all(Radius.circular(10.0)),
                            ),
                            hintText: "you@developer.me",
                          ),
                          controller: emailController,
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value!.isEmpty) {
                              return "Email is required";
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  Column(
                    children: [
                      Row(children: [
                        Text("Password",
                            style: GoogleFonts.outfit(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            )),
                        Text("*", style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.red)),
                      ]),
                      const SizedBox(
                        height: 10,
                      ),
                      TextFormField(
                        decoration: InputDecoration(
                            border: const OutlineInputBorder(
                              borderRadius: BorderRadius.all(Radius.circular(10.0)),
                            ),
                            hintText: "Your password",
                            suffixIcon: GestureDetector(
                              child: Icon(isPasswordVisible ? Icons.visibility_off : Icons.remove_red_eye),
                              onTap: () {
                                setState(() {
                                  isPasswordVisible = !isPasswordVisible;
                                });
                              },
                            )),
                        obscureText: !isPasswordVisible,
                        controller: passwordController,
                        keyboardType: TextInputType.visiblePassword,
                        validator: (value) {
                          if (value!.isEmpty) {
                            return "Password is required";
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  SizedBox(
                    width: double.infinity,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: ElevatedButton(
                        onPressed: () {
                          if (key.currentState == null) return;
                          if (key.currentState!.validate()) {
                            login();
                          }
                        },
                        style: ButtonStyle(backgroundColor: MaterialStateProperty.all<Color>(const Color.fromARGB(255, 255, 214, 10))),
                        child: Text('Login',
                            style: GoogleFonts.outfit(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            )),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      backgroundColor: MAIN,
    );
  }
}
