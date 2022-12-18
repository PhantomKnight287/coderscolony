import 'package:application/constants/color.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:google_fonts/google_fonts.dart';

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

  @override
  void dispose() {
    super.dispose();
    emailController.dispose();
    passwordController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const Image(
                  image: AssetImage("assets/images/login.png"),
                  height: 200,
                ),
                Text(
                  'Welcome Back!',
                  style: GoogleFonts.inter(
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
                      style: GoogleFonts.inter(
                        fontSize: 15,
                      ),
                    ),
                    GestureDetector(
                      onTap: () {},
                      child: Text(
                        'Create Account',
                        style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.blue),
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
                            style: GoogleFonts.inter(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            )),
                        Text("*", style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.red)),
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
                          style: GoogleFonts.inter(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          )),
                      Text("*", style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.red)),
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
                        key.currentState?.validate();
                        print(key.currentState);
                      },
                      style: ButtonStyle(backgroundColor: MaterialStateProperty.all<Color>(SHADE_2_3)),
                      child: const Text('Login'),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
