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
import * as VideoThumbnails from "expo-video-thumbnails";
import axios from "axios";

const AddProduct = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Форма
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [aiUsed, setAiUsed] = useState(false);
  const [video, setVideo] = useState(null); // { uri, duration, width, height, fileSize }
  const [videoThumbnail, setVideoThumbnail] = useState(null);

  // Категориялар
  const categories = [
    { id: 1, name: "Кийим", icon: "shirt-outline" },
    { id: 2, name: "Техника", icon: "phone-portrait-outline" },
    { id: 3, name: "Үй", icon: "home-outline" },
    { id: 4, name: "Красота", icon: "sparkles-outline" },
    { id: 5, name: "Спорт", icon: "fitness-outline" },
    { id: 6, name: "Башка", icon: "grid-outline" },
  ];

  // AI менен сүрөттү анализдөө
  const analyzeWithAI = async (imageUri) => {
    setAiLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "product.jpg",
      });

      const response = await axios.post("/ai/analyze-product/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data, headers) => formData,
        timeout: 30000,
      });

      const data = response.data;
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.category_id) setSelectedCategory(data.category_id);
      setAiUsed(true);
    } catch (error) {
      console.log("AI error:", error.response?.data || error.message);
      // AI иштебесе, колдонуучу өзү толтурат
    } finally {
      setAiLoading(false);
    }
  };

  // Сүрөт тандоо
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((a) => a.uri);
      setImages([...images, ...newImages]);

      // Биринчи сүрөт кошулганда AI анализ жүргүзүү
      if (images.length === 0 && newImages.length > 0 && !aiUsed) {
        analyzeWithAI(newImages[0]);
      }
    }
  };

  // Сүрөт алып салуу
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Видео тандоо
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsMultipleSelection: false,
      videoExportPreset: ImagePicker.VideoExportPreset.H264_1920x1080,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      if (asset.duration > 60000) {
        Alert.alert("Ката", "Видео 60 секунддан ашпашы керек");
        return;
      }

      setVideo({
        uri: asset.uri,
        duration: asset.duration,
        width: asset.width || 1080,
        height: asset.height || 1920,
        fileSize: asset.fileSize || 0,
      });

      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
          time: 1000,
          quality: 0.7,
        });
        setVideoThumbnail(uri);
      } catch (e) {
        console.log("Thumbnail error:", e);
      }
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoThumbnail(null);
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

      // Видео кошуу (эгер бар болсо)
      if (video) {
        const videoFileName = video.uri.split("/").pop();
        formData.append("video", {
          uri: video.uri,
          type: "video/mp4",
          name: videoFileName,
        });
        formData.append("video_duration", String(video.duration / 1000)); // мс → сек
        formData.append("video_width", String(video.width));
        formData.append("video_height", String(video.height));
        formData.append("video_size", String(video.fileSize));

        if (videoThumbnail) {
          formData.append("video_thumbnail", {
            uri: videoThumbnail,
            type: "image/jpeg",
            name: "video_thumb.jpg",
          });
        }
      }

      const response = await axios.post("/seller/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data, headers) => {
          return formData;
        },
        timeout: 300000, // 5 мүнөт (видео жүктөө үчүн)
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
          disabled={loading || aiLoading}
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
            <Text style={styles.sectionHint}>
              Сүрөт кошуңуз — AI автоматтык аталыш жана сүрөттөмө жазат
            </Text>
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

          {/* Видео */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Видео</Text>
            <Text style={styles.sectionHint}>
              Товардын видеосу Reels фидде көрүнөт (макс. 60 сек)
            </Text>

            {video ? (
              <View style={styles.videoPreviewContainer}>
                {videoThumbnail && (
                  <Image source={{ uri: videoThumbnail }} style={styles.videoThumbnail} />
                )}
                <View style={styles.videoPlayOverlay}>
                  <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.9)" />
                </View>
                <TouchableOpacity style={styles.removeVideoButton} onPress={removeVideo}>
                  <Ionicons name="close-circle" size={24} color="#ff4757" />
                </TouchableOpacity>
                <View style={styles.videoDurationBadge}>
                  <Text style={styles.videoDurationText}>
                    {Math.round(video.duration / 1000)}с
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.addVideoButton} onPress={pickVideo}>
                <Ionicons name="videocam" size={32} color="#999" />
                <Text style={styles.addImageText}>Видео кошуу</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* AI Loading */}
          {aiLoading && (
            <View style={styles.aiLoadingContainer}>
              <View style={styles.aiLoadingContent}>
                <ActivityIndicator size="small" color="#7c3aed" />
                <Text style={styles.aiLoadingText}>
                  AI анализдеп жатат...
                </Text>
              </View>
            </View>
          )}

          {/* AI толтурганын көрсөтүү */}
          {aiUsed && !aiLoading && (
            <View style={styles.aiBadgeContainer}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={16} color="#7c3aed" />
                <Text style={styles.aiBadgeText}>AI толтурду — оңдой аласыз</Text>
              </View>
            </View>
          )}

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
                  <Text style={styles.currencyText}>сом</Text>
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
                  <Text style={styles.currencyText}>сом</Text>
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
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 13,
    color: "#999",
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

  // AI Loading
  aiLoadingContainer: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 16,
  },
  aiLoadingContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f0ff",
    padding: 14,
    borderRadius: 12,
  },
  aiLoadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#7c3aed",
    fontWeight: "500",
  },

  // AI Badge
  aiBadgeContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f0ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  aiBadgeText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#7c3aed",
    fontWeight: "500",
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
    fontSize: 16,
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

  // Видео
  videoPreviewContainer: {
    width: 140,
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoPlayOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  removeVideoButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  videoDurationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addVideoButton: {
    width: 140,
    height: 180,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddProduct;
