class Profile {
  final String? bannerImage;
  final String bannerColor;
  final String name;
  final bool verified;
  final String id;
  final String createdAt;
  final int followers;
  final int following;
  final String? oneliner;
  final bool edit;
  final String profileImage;
  final String username;

  const Profile(
      {required this.bannerImage,
      required this.bannerColor,
      required this.name,
      required this.verified,
      required this.id,
      required this.createdAt,
      required this.followers,
      required this.following,
      required this.oneliner,
      required this.edit,
      required this.profileImage,
      required this.username});

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
        bannerImage: json['bannerImage'],
        bannerColor: json['bannerColor'],
        name: json['name'],
        verified: json['verified'],
        id: json['id'],
        createdAt: json['createdAt'],
        followers: json['followers'],
        following: json['following'],
        oneliner: json['oneliner'],
        edit: json['edit'],
        profileImage: json['profileImage'],
        username: json['username']);
  }
}
