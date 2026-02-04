import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  FLASH_SALE_PRODUCTS,
  CLEARANCE_PRODUCTS,
  formatSold,
} from "../data/mockData";

const { width } = Dimensions.get("window");

// Таймер компонент
const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime));

  function getTimeLeft(endTime) {
    const diff = endTime - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const pad = (num) => num.toString().padStart(2, "0");

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{pad(timeLeft.hours)}</Text>
      </View>
      <Text style={styles.timerSeparator}>:</Text>
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{pad(timeLeft.minutes)}</Text>
      </View>
      <Text style={styles.timerSeparator}>:</Text>
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{pad(timeLeft.seconds)}</Text>
      </View>
    </View>
  );
};

// Flash Sale карточка
const FlashSaleCard = ({ item }) => {
  const progress = (item.sold / item.totalStock) * 100;
  const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  return (
    <TouchableOpacity style={styles.flashCard}>
      <Image source={{ uri: item.image }} style={styles.flashImage} />
      <View style={styles.flashDiscountBadge}>
        <Text style={styles.flashDiscountText}>-{discount}%</Text>
      </View>
      <View style={styles.flashInfo}>
        <Text style={styles.flashPrice}>{item.price} ₽</Text>
        <Text style={styles.flashOriginalPrice}>{item.originalPrice} ₽</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.flashSold}>Продано {item.sold} шт</Text>
      </View>
    </TouchableOpacity>
  );
};

// Clearance карточка
const ClearanceCard = ({ item, index }) => {
  const getRankColor = (rank) => {
    if (rank === 1) return "#ff4757";
    if (rank === 2) return "#ff6b81";
    if (rank === 3) return "#ffa502";
    return "#999";
  };

  return (
    <TouchableOpacity style={styles.clearanceCard}>
      <View style={[styles.rankBadge, { backgroundColor: getRankColor(item.rank) }]}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.clearanceImage} />
      <View style={styles.clearanceInfo}>
        <Text style={styles.clearanceTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.clearancePriceRow}>
          <Text style={styles.clearancePrice}>{item.price} ₽</Text>
          <View style={styles.clearanceDiscountBadge}>
            <Text style={styles.clearanceDiscountText}>-{item.discount}%</Text>
          </View>
        </View>
        <Text style={styles.clearanceOriginalPrice}>{item.originalPrice} ₽</Text>
        <Text style={styles.clearanceSold}>{formatSold(item.sold)} продано</Text>
      </View>
    </TouchableOpacity>
  );
};

const SalePage = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff4757" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Распродажа</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Flash Sale Section */}
        <View style={styles.flashSaleSection}>
          <View style={styles.flashSaleHeader}>
            <View style={styles.flashTitleRow}>
              <Ionicons name="flash" size={24} color="#ff4757" />
              <Text style={styles.flashTitle}>Flash Sale</Text>
            </View>
            <View style={styles.flashTimerRow}>
              <Text style={styles.endsInText}>Осталось:</Text>
              <CountdownTimer endTime={FLASH_SALE_PRODUCTS[0]?.endTime || Date.now()} />
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flashScroll}
          >
            {FLASH_SALE_PRODUCTS.map((item) => (
              <FlashSaleCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Clearance Section */}
        <View style={styles.clearanceSection}>
          <View style={styles.clearanceHeader}>
            <View style={styles.clearanceTitleRow}>
              <Ionicons name="trophy" size={24} color="#ff4757" />
              <Text style={styles.clearanceSectionTitle}>Топ скидок</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Все</Text>
              <Ionicons name="chevron-forward" size={16} color="#ff4757" />
            </TouchableOpacity>
          </View>
          <View style={styles.clearanceGrid}>
            {CLEARANCE_PRODUCTS.map((item, index) => (
              <ClearanceCard key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // Header
  header: {
    backgroundColor: "#ff4757",
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  // Flash Sale
  flashSaleSection: {
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  flashSaleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  flashTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flashTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  flashTimerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  endsInText: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerBox: {
    backgroundColor: "#333",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  timerSeparator: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 2,
  },
  flashScroll: {
    paddingHorizontal: 12,
    paddingVertical: 15,
  },
  flashCard: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },
  flashImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  flashDiscountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ff4757",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  flashDiscountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  flashInfo: {
    padding: 10,
  },
  flashPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4757",
  },
  flashOriginalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  progressContainer: {
    height: 6,
    backgroundColor: "#ffe0e3",
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ff4757",
    borderRadius: 3,
  },
  flashSold: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },

  // Clearance
  clearanceSection: {
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  clearanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  clearanceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearanceSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    color: "#ff4757",
  },
  clearanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  clearanceCard: {
    width: (width - 32) / 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },
  rankBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  rankText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  clearanceImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  clearanceInfo: {
    padding: 10,
  },
  clearanceTitle: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    height: 36,
  },
  clearancePriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  clearancePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4757",
  },
  clearanceDiscountBadge: {
    backgroundColor: "#fff0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  clearanceDiscountText: {
    color: "#ff4757",
    fontSize: 11,
    fontWeight: "bold",
  },
  clearanceOriginalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  clearanceSold: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
});

export default SalePage;
