import React, { useState } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const AddProduct = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Форма
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Категориялар
  const categories = [
    { id: 1, name: "Кийим", icon: "shirt-outline" },
    { id: 2, name: "Техника", icon: "phone-portrait-outline" },
    { id: 3, name: "Үй", icon: "home-outline" },
    { id: 4, name: "Красота", icon: "sparkles-outline" },
    { id: 5, name: "Спорт", icon: "fitness-outline" },
    { id: 6, name: "Башка", icon: "grid-outline" },
  ];

  // Сүрөт тандоо
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - images.length,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((a) => a.uri)]);
    }
  };

  // Сүрөт алып салуу
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Товар сактоо
  const saveProduct = async () => {
    // Валидация
    if (!title.trim()) {
      Alert.alert("Ката", "Товардын атын жазыңыз");
      return;
    }
    if (!price.trim()) {
      Alert.alert("Ката", "Баасын жазыңыз");
      return;
    }
    if (images.length === 0) {
      Alert.alert("Ката", "Жок дегенде 1 сүрөт кошуңуз");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("original_price", originalPrice || price);
      formData.append("stock", stock || "0");
      if (selectedCategory) {
        formData.append("category_id", selectedCategory);
      }

      // Сүрөттөрдү кошуу
      images.forEach((uri, index) => {
        formData.append("images", {
          uri: uri,
          type: "image/jpeg",
          name: `product_${index}.jpg`,
        });
      });

      // Authorization header менен жөнөтүү
      const response = await axios.post("/seller/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data, headers) => {
          return formData;
        },
      });

      Alert.alert("Ийгилик!", "Товар кошулду", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log("Product error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.response?.data?.detail || "Бир жаат кетти";
      Alert.alert("Ката", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Товар кошуу</Text>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={saveProduct}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Сактоо</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Сүрөттөр */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Сүрөттөр *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.imagesContainer}>
                {images.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.productImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff4757" />
                    </TouchableOpacity>
                    {index === 0 && (
                      <View style={styles.mainImageBadge}>
                        <Text style={styles.mainImageText}>Негизги</Text>
                      </View>
                    )}
                  </View>
                ))}

                {images.length < 5 && (
                  <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
                    <Ionicons name="camera" size={32} color="#999" />
                    <Text style={styles.addImageText}>Кошуу</Text>
                    <Text style={styles.addImageCount}>{images.length}/5</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>

          {/* Негизги маалымат */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Негизги маалымат</Text>

            <Text style={styles.label}>Товардын аты *</Text>
            <TextInput
              style={styles.input}
              placeholder="Мисалы: Кышкы куртка аялдар үчүн"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Сүрөттөмө</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Товар жөнүндө толук маалымат..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>

          {/* Категория */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Категория</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={24}
                    color={selectedCategory === cat.id ? "#ff4757" : "#666"}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === cat.id && styles.categoryTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Баа */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Баа</Text>

            <View style={styles.priceRow}>
              <View style={styles.priceInput}>
                <Text style={styles.label}>Баасы *</Text>
                <View style={styles.priceInputWrapper}>
                  <TextInput
                    style={styles.priceField}
                    placeholder="0"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.currencyText}>₽</Text>
                </View>
              </View>

              <View style={styles.priceInput}>
                <Text style={styles.label}>Эски баа</Text>
                <View style={styles.priceInputWrapper}>
                  <TextInput
                    style={styles.priceField}
                    placeholder="0"
                    value={originalPrice}
                    onChangeText={setOriginalPrice}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.currencyText}>₽</Text>
                </View>
              </View>
            </View>

            {originalPrice && parseFloat(originalPrice) > parseFloat(price) && (
              <View style={styles.discountBadge}>
                <Ionicons name="pricetag" size={16} color="#ff4757" />
                <Text style={styles.discountText}>
                  Скидка: {Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)}%
                </Text>
              </View>
            )}
          </View>

          {/* Калдык */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Калдык</Text>
            <TextInput
              style={styles.input}
              placeholder="Канча даана бар?"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  saveButton: {
    backgroundColor: "#ff4757",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  section: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  // Сүрөттөр
  imagesContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 12,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  mainImageBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainImageText: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  addImageCount: {
    fontSize: 10,
    color: "#ccc",
    marginTop: 2,
  },

  // Категориялар
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  categoryButton: {
    width: "30%",
    margin: "1.5%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#ff4757",
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
  },
  categoryTextActive: {
    color: "#ff4757",
    fontWeight: "600",
  },

  // Баа
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  priceField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  currencyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
  },
  discountBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#fff5f5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  discountText: {
    color: "#ff4757",
    fontWeight: "600",
    marginLeft: 6,
  },
});

export default AddProduct;
