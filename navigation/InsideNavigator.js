import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Страницы
import HomePage from "../pages/homePage";
import Feed from "../pages/feed";
import ProfilePage from "../pages/profilePage";
import CreateScreen from "../pages/create";
import PostPage from "../pages/post";
import SearchPage from "../pages/search";
import FeedProfile from "../pages/feedProfile";
import AccountSettings from "../pages/accountSettings";
import UserPreferences from "../pages/userPreferences";
import SalePage from "../pages/salePage";
import SellerDashboard from "../pages/sellerDashboard";
import AddProduct from "../pages/addProduct";
import ProductDetail from "../pages/productDetail";

// Навигаторы
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Стек главной страницы (Товары)
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="Search" component={SearchPage} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
};

// Стек Reels (Видео)
const ReelsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="FeedProfile" component={FeedProfile} />
      <Stack.Screen name="Post" component={PostPage} />
      <Stack.Screen name="Search" component={SearchPage} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
};

// Стек профиля
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfilePage" component={ProfilePage} />
      <Stack.Screen name="AccountSettings" component={AccountSettings} />
      <Stack.Screen name="UserPreferences" component={UserPreferences} />
      <Stack.Screen name="Post" component={PostPage} />
      <Stack.Screen name="SellerDashboard" component={SellerDashboard} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
};

export default function InsideNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Reels") {
            iconName = focused ? "play-circle" : "play-circle-outline";
          } else if (route.name === "Sale") {
            iconName = focused ? "pricetag" : "pricetag-outline";
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ff4757",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Главная",
        }}
      />
      <Tab.Screen
        name="Reels"
        component={ReelsStack}
        options={{
          tabBarLabel: "Reels",
        }}
      />
      <Tab.Screen
        name="Sale"
        component={SalePage}
        options={{
          tabBarLabel: "Скидки",
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarLabel: "Создать",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: "Профиль",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
