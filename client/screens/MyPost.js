import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import FooterMenu from "../components/Menus/FooterMenu";
import axios from "axios";
import PostCard from "../components/PostCard";

const MyPost = () => {
  // state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  //   get user posts
  const getUserPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/posts/get-user-post");

      setLoading(false);
      setPosts(data?.userPosts);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  };

  // initial
  useEffect(() => {
    getUserPosts();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <PostCard posts={posts} myPostScreen={true} />
      </ScrollView>
      {/* <Text>{JSON.stringify(posts, null, 4)}</Text> */}
      <ScrollView>{/* <PostCard posts={posts} /> */}</ScrollView>
      <View style={{ backgroundColor: "#ffffff" }}>
        <FooterMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    margin: 10,
  },
});
export default MyPost;
