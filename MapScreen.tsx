import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, PermissionsAndroid, Platform,} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import MapViewClustering from 'react-native-map-clustering';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import mapStyles from './styles/components/mapStyles';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';

interface Pothole {
  lat: number;
  lng: number;
  depth: number;
  severity: string;
}

const MapScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | null>(null);
  const [followUser, setFollowUser] = useState(true);
  const mapRef = useRef<MapView>(null);

  // 🔹 Request permission + get initial location
  useEffect(() => {
    const getPermissionAndLocation = async () => {
      try {
        if (Platform.OS === 'ios') {
          await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
        }

        Geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            setRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            setLoading(false);
          },
          err => {
            console.warn('Location error:', err);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        console.warn('Location permission error:', err);
        setLoading(false);
      }
    };

    getPermissionAndLocation();
  }, []);

  // 🔹 Watch for GPS updates
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        if (followUser) {
          mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      },
      err => console.warn('Watch error:', err),
      { enableHighAccuracy: true, distanceFilter: 5 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [followUser]);

  // 🔹 Fetch potholes
  useEffect(() => {
    axios
      .get('http://10.0.2.2:3000/api/potholes')
      .then(res => setPotholes(res.data))
      .catch(() => {
        console.log('Backend not running — showing map only');
        setPotholes([]);
      });
  }, []);

  if (loading || !region) {
    return (
      <SafeAreaView style={mapStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF8E8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={mapStyles.container}>
      {/* Map */}
      <MapViewClustering
        ref={mapRef}
        style={mapStyles.map}
        initialRegion={region}
        showsUserLocation
        followsUserLocation={false}
        showsMyLocationButton
        showsCompass
        zoomControlEnabled
        provider={Platform.OS === 'ios' ? null : 'google'}
        clusterColor="#2A9D8F"
        clusterTextColor="#FFFFFF"
        spiralEnabled
        animationEnabled
        onPanDrag={() => setFollowUser(false)} // stop following when user pans
      >
      {/* 🔹 Static test pins (UCF area for demo) */}
        <Marker
          coordinate={{ latitude: 28.6025, longitude: -81.2005 }}
          title="Test Pothole 1"
          description="Depth: 2.5 in"
          pinColor="#F4A261"
        />
        <Marker
          coordinate={{ latitude: 28.6040, longitude: -81.1990 }}
          title="Test Pothole 2"
          description="Depth: 4.0 in"
          pinColor="#E63946"
        />
        <Marker
          coordinate={{ latitude: 28.6010, longitude: -81.2030 }}
          title="Test Pothole 3"
          description="Depth: 1.2 in"
          pinColor="#FFD166"
        />
        {/* Pothole markers */}
        {potholes.map((p, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={`Pothole (${p.severity})`}
            description={`Depth: ${p.depth ?? 'N/A'} in`}
            pinColor={
              p.severity === 'minor'
                ? '#FFD166'
                : p.severity === 'moderate'
                ? '#F4A261'
                : p.severity === 'severe'
                ? '#E63946'
                : '#2A9D8F'
            }
          />
        ))}
      </MapViewClustering>
          <TouchableOpacity
              style={mapStyles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={mapStyles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          
      {/*Recenter Button */}
          <TouchableOpacity
            onPress={() => setFollowUser(true)}
            style={mapStyles.recenterButton}
            activeOpacity={0.8}
          >
            <Text style={mapStyles.recenterText}>Recenter</Text>
          </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MapScreen;
