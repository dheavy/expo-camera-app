import React, { useState } from 'react';
import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type Maybe<T> = T | null;
interface Photo {
  width: number;
  height: number;
  uri: string;
};

export default function App() {
  let camera: Camera;

  const [isCameraStarted, setCameraStarted] = useState(false);
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<Maybe<Photo>>(null);

  const startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setCameraStarted(true);
    } else {
      Alert.alert('Access denied');
    }
  };

  const takePicture = async () => {
    if (!camera) return
    const photo: Photo = await camera.takePictureAsync();
    console.log(photo);
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const resetPicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    startCamera();
  };

  const savePhoto = async () => {
    const { uri } = capturedImage!;
    await MediaLibrary.saveToLibraryAsync(uri);
    resetPicture();
  };

  const CameraPreview = ({ photo }: any) => {
    const { uri } = photo;

    return (
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        <ImageBackground
          source={{uri}}
          style={{flex: 1}}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              padding: 15,
              justifyContent: 'flex-end'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <TouchableOpacity
                onPress={resetPicture}
                style={{
                  width: 130,
                  height: 40,
                  alignItems: 'center',
                  borderRadius: 4
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20
                  }}
                >
                  Re-take
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={savePhoto}
                style={{
                  width: 130,
                  height: 40,
                  alignItems: 'center',
                  borderRadius: 4
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20
                  }}
                >
                  Save photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isCameraStarted ? (
        isPreviewVisible && capturedImage! ? (
          <CameraPreview
            photo={capturedImage}
            savePhoto={savePhoto}
            resetPicture={resetPicture}
          />
        ) : (
          <Camera
            style={{
              flex: 1,
              width: '100%'
            }}
            ref={r => { if (r) camera = r }}
          >
            <View
              style={{
                position: 'absolute',
                bottom: 50,
                flexDirection: 'row',
                flex: 1,
                width: '100%',
                padding: 20,
                justifyContent: 'space-between'
              }}
            >
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  flex: 1
                }}
              >
                <TouchableOpacity
                  onPress={takePicture}
                  style={{
                    width: 70,
                    height: 70,
                    bottom: 0,
                    borderRadius: 50,
                    backgroundColor: '#fff'
                  }}
                />
              </View>
            </View>
          </Camera>
        )
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={startCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Take Picture
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
