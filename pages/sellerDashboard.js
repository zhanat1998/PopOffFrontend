import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const { width } = Dimensions.get("window");

const SellerDashboard = () => {
  const navigation = useNavigation();
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [products, setProducts] = useState([]);

  // Катталуу формасы
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    checkSellerStatus();
  }, []);

  const checkSellerStatus = async () => {
    try {
      const response = await axios.get("/seller/profile/");
      if (response.data.is_seller) {
        setIsSeller(true);
        setSellerData(response.data.seller);
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.log("Not a seller yet");
    } finally {
      setLoading(false);
    }
  };

  const registerAsSeller = async () => {
    if (!shopName.trim()) {
      Alert.alert("Ката", "Дүкөндүн атын жазыңыз");
      return;
    }

    setRegistering(true);
    try {
      const response = await axios.post("/seller/register/", {
        shop_name: shopName,
        description: description,
        phone: phone,
        city: city,
      });

      setIsSeller(true);
      setSellerData(response.data);
      Alert.alert("Ийгилик!", "Сиз сатуучу болдуңуз!");
    } catch (error) {
      Alert.alert("Ката", error.response?.data?.message || "Бир жаат кетти");
    } finally {
      setRegistering(false);
    }
  };

  // Сатуучу эмес - катталуу формасы
  const renderRegistrationForm = () => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Сатуучу болуу</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.iconContainer}>
        <View style={styles.bigIcon}>
          <Ionicons name="storefront" size={60} color="#ff4757" />
        </View>
        <Text style={styles.welcomeText}>PopOff'то сатуучу болуңуз!</Text>
        <Text style={styles.subtitleText}>Миллиондогон сатып алуучуларга жетиңиз</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Дүкөндүн аты *</Text>
        <TextInput
          style={styles.input}
          placeholder="Мисалы: Айжан бутик"
          value={shopName}
          onChangeText={setShopName}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Сүрөттөмө</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Дүкөнүңүз жөнүндө кыскача"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Телефон</Text>
        <TextInput
          style={styles.input}
          placeholder="+996 XXX XXX XXX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Шаар</Text>
        <TextInput
          style={styles.input}
          placeholder="Бишкек"
          value={city}
          onChangeText={setCity}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={[styles.registerButton, registering && styles.buttonDisabled]}
        onPress={registerAsSeller}
        disabled={registering}
      >
        {registering ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.registerButtonText}>Сатуучу болуу</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>Артыкчылыктар:</Text>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
          <Text style={styles.benefitText}>Комиссия жок</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
          <Text style={styles.benefitText}>Чексиз товар жүктөө</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
          <Text style={styles.benefitText}>Миллиондогон сатып алуучу</Text>
        </View>
      </View>
    </ScrollView>
  );

  // Сатуучу - Dashboard
  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Менин дүкөнүм</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Дүкөн маалыматы */}
        <View style={styles.shopInfoCard}>
          <View style={styles.shopLogo}>
            <Ionicons name="storefront" size={40} color="#ff4757" />
          </View>
          <View style={styles.shopDetails}>
            <Text style={styles.shopName}>{sellerData?.shop_name}</Text>
            <Text style={styles.shopCity}>
              <Ionicons name="location-outline" size={14} color="#666" /> {sellerData?.city || "Шаар көрсөтүлгөн эмес"}
            </Text>
          </View>
        </View>

        {/* Статистика */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={28} color="#3498db" />
            <Text style={styles.statNumber}>{sellerData?.total_products || 0}</Text>
            <Text style={styles.statLabel}>Товарлар</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cart-outline" size={28} color="#2ecc71" />
            <Text style={styles.statNumber}>{sellerData?.total_sales || 0}</Text>
            <Text style={styles.statLabel}>Сатуулар</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star-outline" size={28} color="#f1c40f" />
            <Text style={styles.statNumber}>{sellerData?.rating?.toFixed(1) || "5.0"}</Text>
            <Text style={styles.statLabel}>Рейтинг</Text>
          </View>
        </View>

        {/* Тез баскычтар */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("AddProduct")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#fff5f5" }]}>
              <Ionicons name="add-circle" size={28} color="#ff4757" />
            </View>
            <Text style={styles.actionText}>Товар кошуу</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#f0f8ff" }]}>
              <Ionicons name="list" size={28} color="#3498db" />
            </View>
            <Text style={styles.actionText}>Заказдар</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#f0fff0" }]}>
              <Ionicons name="stats-chart" size={28} color="#2ecc71" />
            </View>
            <Text style={styles.actionText}>Статистика</Text>
          </TouchableOpacity>
        </View>

        {/* Товарлар */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Менин товарларым</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Баары</Text>
            </TouchableOpacity>
          </View>

          {products.length === 0 ? (
            <View style={styles.emptyProducts}>
              <Ionicons name="cube-outline" size={60} color="#ddd" />
              <Text style={styles.emptyText}>Товар жок</Text>
              <TouchableOpacity
                style={styles.addFirstProduct}
                onPress={() => navigation.navigate("AddProduct")}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addFirstProductText}>Биринчи товарды кошуу</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={products}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.productCard}>
                  <Image source={{ uri: item.images[0] }} style={styles.productImage} />
                  <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.productPrice}>{item.price} ₽</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4757" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isSeller ? renderDashboard() : renderRegistrationForm()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  settingsButton: {
    padding: 8,
  },

  // Катталуу формасы
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  iconContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  bigIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  subtitleText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  formSection: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4757",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  benefitsSection: {
    padding: 20,
    marginTop: 10,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },

  // Dashboard
  dashboardContainer: {
    flex: 1,
  },
  shopInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  shopLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  shopDetails: {
    marginLeft: 16,
    flex: 1,
  },
  shopName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  shopCity: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#333",
  },
  productsSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#ff4757",
  },
  emptyProducts: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
  },
  addFirstProduct: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4757",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  addFirstProductText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  productCard: {
    width: 140,
    marginRight: 12,
  },
  productImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  productTitle: {
    fontSize: 13,
    color: "#333",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4757",
    marginTop: 4,
  },
});

export default SellerDashboard;
