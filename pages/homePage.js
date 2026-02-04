import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CATEGORIES,
  PRODUCTS,
  HOT_PRODUCTS,
  formatSold,
  calculateDiscount,
} from "../data/mockData";

const { width } = Dimensions.get("window");
const PRODUCT_WIDTH = (width - 24) / 2;

// Быстрые действия (Pinduoduo style)
const QUICK_ACTIONS = [
  { id: "1", name: "Молния\nраспродажа", icon: "flash", color: "#ff4757", bg: "#fff5f5" },
  { id: "2", name: "Бесплатная\nдоставка", icon: "car", color: "#3498db", bg: "#f0f8ff" },
  { id: "3", name: "Новинки", icon: "sparkles", color: "#9b59b6", bg: "#faf5ff" },
  { id: "4", name: "Купоны", icon: "ticket", color: "#e67e22", bg: "#fff8f0" },
  { id: "5", name: "Топ\nпродаж", icon: "trophy", color: "#f1c40f", bg: "#fffef0" },
];

// Карточка товара (Pinduoduo style)
const ProductCard = ({ item, onPress }) => {
  const discount = calculateDiscount(item.originalPrice, item.price);

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Бесплатная доставка</Text>
          </View>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceSymbol}>₽</Text>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.originalPrice}>₽{item.originalPrice}</Text>
        </View>
        <Text style={styles.soldText}>{formatSold(item.sold)} продано</Text>
      </View>
    </TouchableOpacity>
  );
};

// Горячий товар
const HotProductCard = ({ item }) => (
  <TouchableOpacity style={styles.hotProductCard} activeOpacity={0.9}>
    <Image source={{ uri: item.image }} style={styles.hotProductImage} />
    <Text style={styles.hotProductTitle} numberOfLines={1}>{item.title}</Text>
    <Text style={styles.hotProductPrice}>₽{item.price}</Text>
  </TouchableOpacity>
);

// Быстрое действие
const QuickActionButton = ({ item }) => (
  <TouchableOpacity style={styles.quickActionButton} activeOpacity={0.8}>
    <View style={[styles.quickActionIcon, { backgroundColor: item.bg }]}>
      <Ionicons name={item.icon} size={26} color={item.color} />
    </View>
    <Text style={styles.quickActionText}>{item.name}</Text>
  </TouchableOpacity>
);

const HomePage = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [searchText, setSearchText] = useState("");

  const handleProductPress = (product) => {
    console.log("Товар выбран:", product.title);
  };

  const renderProduct = useCallback(
    ({ item }) => (
      <ProductCard item={item} onPress={() => handleProductPress(item)} />
    ),
    []
  );

  const keyExtractor = useCallback((item) => item.id, []);

  // Шапка
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Верхняя панель с поиском */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск товаров"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Поиск</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="camera-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Категории */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryTab}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
              {selectedCategory === cat.id && (
                <View style={styles.categoryIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Главный баннер */}
      <View style={styles.bannerContainer}>
        <View style={styles.mainBanner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>🎉 МЕГА РАСПРОДАЖА</Text>
            <Text style={styles.bannerSubtitle}>Скидки до 70% на всё!</Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Смотреть</Text>
              <Ionicons name="chevron-forward" size={14} color="#ff4757" />
            </View>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerEmoji}>🛍️</Text>
          </View>
        </View>
      </View>

      {/* Уведомление */}
      <View style={styles.noticeBar}>
        <Ionicons name="megaphone" size={16} color="#ff4757" />
        <Text style={styles.noticeText}>
          Бесплатная доставка при заказе от 1000₽
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#999" />
      </View>

      {/* Быстрые действия */}
      <View style={styles.quickActionsContainer}>
        {QUICK_ACTIONS.map((action) => (
          <QuickActionButton key={action.id} item={action} />
        ))}
      </View>

      {/* Горячие товары */}
      <View style={styles.hotSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.hotIcon}>
              <Text style={styles.hotIconText}>🔥</Text>
            </View>
            <Text style={styles.sectionTitle}>Хиты продаж</Text>
            <View style={styles.hotLabel}>
              <Text style={styles.hotLabelText}>ТОП</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Ещё</Text>
            <Ionicons name="chevron-forward" size={14} color="#999" />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hotProductsScroll}
        >
          {HOT_PRODUCTS.map((product) => (
            <HotProductCard key={product.id} item={product} />
          ))}
        </ScrollView>
      </View>

      {/* Заголовок рекомендаций */}
      <View style={styles.recommendedHeader}>
        <View style={styles.recommendedTitleRow}>
          <Text style={styles.recommendedEmoji}>✨</Text>
          <Text style={styles.recommendedTitle}>Рекомендуем вам</Text>
        </View>
        <Text style={styles.recommendedSubtitle}>Подобрано специально для вас</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {/* Плавающая кнопка чата */}
      <TouchableOpacity style={styles.floatingChatButton} activeOpacity={0.9}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        <View style={styles.chatBadge}>
          <Text style={styles.chatBadgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    backgroundColor: "#fff",
  },
  listContent: {
    paddingBottom: 20,
  },

  // Верхняя панель
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingLeft: 12,
    overflow: "hidden",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    paddingVertical: 8,
  },
  searchButton: {
    backgroundColor: "#ff4757",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  iconButton: {
    marginLeft: 10,
    padding: 6,
  },

  // Категории (Pinduoduo style)
  categoriesWrapper: {
    backgroundColor: "#fff",
  },
  categoriesContent: {
    paddingHorizontal: 4,
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: "center",
    position: "relative",
  },
  categoryText: {
    fontSize: 15,
    color: "#333",
  },
  categoryTextActive: {
    color: "#ff4757",
    fontWeight: "bold",
  },
  categoryIndicator: {
    marginTop: 6,
    width: 20,
    height: 3,
    backgroundColor: "#ff4757",
    borderRadius: 2,
    alignSelf: "center",
  },

  // Баннер
  bannerContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: "#fff",
  },
  mainBanner: {
    backgroundColor: "#ff4757",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerLeft: {
    flex: 1,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginTop: 4,
  },
  bannerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  bannerButtonText: {
    color: "#ff4757",
    fontSize: 12,
    fontWeight: "600",
  },
  bannerRight: {
    marginLeft: 10,
  },
  bannerEmoji: {
    fontSize: 50,
  },

  // Уведомление
  noticeBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8f0",
    marginHorizontal: 12,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  noticeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#666",
  },

  // Быстрые действия
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  quickActionButton: {
    alignItems: "center",
    width: (width - 24) / 5,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 11,
    color: "#333",
    textAlign: "center",
    lineHeight: 14,
  },

  // Горячие товары
  hotSection: {
    backgroundColor: "#fff",
    marginTop: 8,
    paddingTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  hotIcon: {
    marginRight: 6,
  },
  hotIconText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  hotLabel: {
    backgroundColor: "#ff4757",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  hotLabelText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 13,
    color: "#999",
  },
  hotProductsScroll: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  hotProductCard: {
    width: 110,
    marginRight: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
  },
  hotProductImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  hotProductTitle: {
    fontSize: 12,
    color: "#333",
    marginTop: 6,
    textAlign: "center",
  },
  hotProductPrice: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "bold",
    color: "#ff4757",
  },

  // Рекомендации
  recommendedHeader: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  recommendedTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  recommendedEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  recommendedSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  // Сетка товаров
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  productCard: {
    width: PRODUCT_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    overflow: "hidden",
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: PRODUCT_WIDTH,
    resizeMode: "cover",
    backgroundColor: "#f5f5f5",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 0,
    backgroundColor: "#ff4757",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  productInfo: {
    padding: 10,
  },
  productTitle: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    minHeight: 36,
  },
  tagsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  tag: {
    backgroundColor: "#fff5f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  tagText: {
    fontSize: 10,
    color: "#ff4757",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  priceSymbol: {
    fontSize: 12,
    color: "#ff4757",
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    color: "#ff4757",
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    color: "#bbb",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  soldText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },

  // Плавающая кнопка чата
  floatingChatButton: {
    position: "absolute",
    bottom: 20,
    right: 16,
    backgroundColor: "#ff4757",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#ff4757",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  chatBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  chatBadgeText: {
    color: "#ff4757",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default HomePage;
