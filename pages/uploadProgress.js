import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import PrimaryStyles from '../styles/primaryStyles';
import { Ionicons } from '@expo/vector-icons';


const UploadProgressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { asset, description, tagsList, thumbnailUri } = route.params;
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(true);
  const isCancelledRef = useRef(false);

  /**
   * Aborts and returns to the previous screen.
   */
  const cancelUpload = () => {
    isCancelledRef.current = true;
    navigation.goBack();
  };

  /**
   * Upload video to backend for HLS processing
   */
  const uploadVideoToBackend = async () => {
    if (isCancelledRef.current) throw new Error('Upload cancelled');

    // Create FormData for multipart/form-data upload
    const formData = new FormData();

    // Add video file
    const videoUri = asset.uri;
    const fileName = videoUri.split('/').pop();
    const fileType = `video/${fileName.split('.').pop()}`;

    formData.append('video', {
      uri: videoUri,
      name: fileName,
      type: fileType,
    });

    setProgress(0.1);

    try {
      // Upload to backend for HLS processing
      const response = await axios.post('/media/process_video/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (isCancelledRef.current) return;
          const percentCompleted = progressEvent.loaded / progressEvent.total;
          setProgress(percentCompleted * 0.8); // 0-80% for upload
        },
      });

      if (isCancelledRef.current) throw new Error('Upload cancelled');

      const { playlist_path } = response.data;
      setProgress(0.9);

      return playlist_path;

    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Upload failed');
      }
      throw error;
    }
  };

  /**
   * Upload thumbnail to R2
   */
  const uploadThumbnail = async () => {
    if (isCancelledRef.current) throw new Error('Upload cancelled');

    try {
      // Get presigned URL for thumbnail
      const baseName = asset.uri.split('/').pop().split('.')[0];
      const response = await axios.post('/media/upload/', {
        base_name: baseName,
        type: 'image/jpeg',
      });

      const { upload_url, file_path } = response.data;

      // Upload thumbnail to R2
      const thumbnailBlob = await (await fetch(thumbnailUri)).blob();
      await fetch(upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: thumbnailBlob,
      });

      setProgress(0.95);
      return file_path;

    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      // Continue without thumbnail
      return null;
    }
  };

  /**
   * Upload metadata to database
   */
  const uploadMetadata = async (video_file_path, thumb_file_path) => {
    const tags = tagsList.join(',');
    const payload = {
      file_path: video_file_path,
      thumbnail_path: thumb_file_path || '',
      file_size: asset.fileSize || 0,
      length: asset.duration || 0,
      width: asset.width || 0,
      height: asset.height || 0,
      description,
      tags,
    };
    await axios.post('/media/post/', payload);
    setProgress(1);
  };

  const startUpload = async () => {
    try {
      setProcessing(true);

      // 1. Upload video to backend for HLS processing
      const video_file_path = await uploadVideoToBackend();

      setProcessing(false);

      // 2. Upload thumbnail
      const thumb_file_path = await uploadThumbnail();

      // 3. Upload metadata to database
      await uploadMetadata(video_file_path, thumb_file_path);

      Alert.alert('Success', 'Upload complete!', [
        { text: 'OK', onPress: () => navigation.popToTop() },
      ]);
    } catch (err) {
      if (isCancelledRef.current) {
        return; // do nothing if cancelled
      }
      console.error(err);
      Alert.alert('Error', err.message || 'Something went wrong during upload.');
      navigation.goBack();
    }
  };

  useEffect(() => {
    startUpload();
  }, []);

  return (
    <View style={styles.container}>
      {processing ? (
        <Text style={PrimaryStyles.title}>Processing...</Text>
      ) : (
        <Text style={PrimaryStyles.title}>Uploading...</Text>
      )}

      <Progress.Bar progress={progress} width={200} animated color="rgb(255, 36, 83)" />
      <TouchableOpacity onPress={cancelUpload} style={styles.cancelButton}>
        <Ionicons name="close" size={28} color="rgb(150, 150, 150)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: "black" },
  text: { fontSize: 20, marginBottom: 20, color: "white" },
  cancelButton: {
    margin: 20
  },
});

export default UploadProgressScreen;
