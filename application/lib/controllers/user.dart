import 'package:get/get.dart';

class UserController extends GetxController {
  var token = "".obs;
  var id = "".obs;
  var name = "".obs;
  var username = "".obs;
  var profile = "".obs;

  void bulkUpdate(Map<String, dynamic> data) {
    token.value = data['token'];
    id.value = data['id'];
    name.value = data['name'];
    username.value = data['username'];
    profile.value = data['profile'];
  }

  void clear() {
    token.value = "";
    id.value = "";
    name.value = "";
    username.value = "";
    profile.value = "";
  }
}
