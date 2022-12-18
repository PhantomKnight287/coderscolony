import 'package:application/constants/color.dart';
import 'package:application/controllers/user.dart';
import 'package:application/screens/auth/login.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

void main() {
  runApp(MaterialApp(
    title: 'Coders Colony',
    theme: ThemeData(primaryColor: SHADE_2_3),
    home: Entry(),
  ));
}

class Entry extends StatelessWidget {
  const Entry({super.key});

  @override
  Widget build(BuildContext context) {
    final UserController c = Get.put(UserController());
    return Scaffold(
        drawer: Drawer(
          child: ListView(
            children: [
              DrawerHeader(
                child: Text('Coders Colony'),
              ),
              ListTile(
                title: Text('Logout'),
                onTap: () {
                  c.clear();
                  Get.offAllNamed('/login');
                },
              )
            ],
          ),
        ),
        appBar: AppBar(
          // show user's profile picture as appbar icon on the right
          // if user is not logged in, show a default profile picture
          actions: [
            IconButton(
                icon: c.profile.value != ""
                    ? CircleAvatar(
                        backgroundImage: NetworkImage(c.profile.value),
                      )
                    : Icon(Icons.person),
                onPressed: () {
                  if (c.profile.value != "") {
                    showModalBottomSheet(
                        context: context,
                        builder: (BuildContext builder) {
                          return Container(
                            child: SizedBox(
                              height: 200,
                            ),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(20),
                                topRight: Radius.circular(20),
                              ),
                            ),
                          );
                        });
                  } else {
                    Navigator.push(context, CupertinoPageRoute(builder: (context) {
                      return LoginScreen();
                    }));
                  }
                })
          ],
          backgroundColor: Colors.transparent,
          elevation: 0,
          foregroundColor: Colors.black,
        ),
        body: Center(
          child: Text('Hello World'),
        ));
  }
}
