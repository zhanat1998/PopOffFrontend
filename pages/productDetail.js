import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/products/${productId}/`);
      setProduct(response.data);
    } catch (error) {
      console.log('Product fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4757" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Товар табылган жок</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Артка</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = product.images || [];
  const hasDiscount = product.discount_percent > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Товар</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        {images.length > 0 && (
          <View>
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setActiveImage(index);
              }}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.productImage} />
              )}
              keyExtractor={(_, i) => String(i)}
            />
            {images.length > 1 && (
              <View style={styles.dotsContainer}>
                {images.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, activeImage === i && styles.dotActive]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Price */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>{product.price} сом</Text>
          {hasDiscount && (
            <View style={styles.discountRow}>
              <Text style={styles.originalPrice}>{product.original_price} сом</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discount_percent}%</Text>
              </View>
            </View>
          )}
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.productTitle}>{product.title}</Text>
        </View>

        {/* Description */}
        {product.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Сүрөттөмө</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        ) : null}

        {/* Seller Info */}
        {product.seller_name && (
          <View style={styles.sellerSection}>
            <Ionicons name="storefront-outline" size={20} color="#666" />
            <Text style={styles.sellerName}>{product.seller_name}</Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.section}>
          {product.category_name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Категория</Text>
              <Text style={styles.infoValue}>{product.category_name}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Калдык</Text>
            <Text style={styles.infoValue}>{product.stock} шт</Text>
          </View>
          {product.sold_count > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Сатылган</Text>
              <Text style={styles.infoValue}>{product.sold_count} шт</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Buy Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Сатып алуу</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtnText: {
    color: '#ff4757',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerBtn: {
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    resizeMode: 'cover',
    backgroundColor: '#f5f5f5',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#ff4757',
  },
  priceSection: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff4757',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 26,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  sellerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sellerName: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  buyButton: {
    backgroundColor: '#ff4757',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetail;
