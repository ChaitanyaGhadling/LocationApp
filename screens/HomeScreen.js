import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const LOCATION_TASK_NAME = 'background-location-task';

const HomeScreen = ({ navigation }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const route = useRoute();

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      // Handle error
      return;
    }
    if (data) {
      const { locations } = data;
      if (locations && locations.length > 0) {
        const latestLocation = locations[locations.length - 1];
        const { latitude, longitude } = latestLocation.coords;
        const locationData = {
          email: route.params.email,
          datetime: new Date().toISOString().replace('T', ' ').substr(0, 19),
          latitude: latitude,
          longitude: longitude,
        };
        console.log(locationData);
        console.log(latitude, longitude);
        try {
          await axios.post('http://192.168.1.161:3000/location/add', locationData);
          console.log('Location data sent to server');
        } catch (error) {
          console.error('Error sending location data:', error);
        }

        setCurrentLocation(`${latitude}, ${longitude}`);
      }
    }
  });

  const handleCheck = async () => {
    if (!isCheckedIn) {
      await startLocationTask();
    } else {
      await stopLocationTask();
    }
  };

  const startLocationTask = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    console.log(status);
    if (status === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 10000, // 10 seconds
      });
      setIsCheckedIn(true);
      setIsTimerVisible(true);
    }
  };

  const stopLocationTask = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    setIsCheckedIn(false);
    setIsTimerVisible(false);
  };

  /*const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Highest
        });
      }
    }
  };*/

  useEffect(() => {
    let interval;

    if (isTimerVisible) {
      interval = setInterval(() => {
        setTimerSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    

    return () => {
      clearInterval(interval);
    };
  }, [isTimerVisible]);

  useEffect(() => {
    let interval;

    if (isCheckedIn) {
      interval = setInterval(() => {
        startLocationTask();
      }, 10000);
    }
    

    return () => {
      clearInterval(interval);
    };
  }, [isCheckedIn]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderCheckButton = () => {
    return (
      <Button
        title={isCheckedIn ? 'Check Out' : 'Check In'}
        onPress={handleCheck}
      />
    );
  };

  const renderCheckText = () => {
    return (
      <Text style={styles.checkText}>
        {isCheckedIn ? 'Checked In' : 'Not Checked In'}
      </Text>
    );
  };

  const renderTimer = () => {
    return isTimerVisible ? (
      <Text style={styles.timerText}>Working Time: {formatTime(timerSeconds)} seconds</Text>
    ) : null;
  };


  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {route.params.email}</Text>
      <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
      <Text style={styles.locationText}>
        {currentLocation ? `Current Location: ${currentLocation}` : ''}
      </Text>
      {renderCheckText()}
      {renderCheckButton()}
      {renderTimer()}
      <View style={styles.spacing} />
      <Button
        title="Logout"
        onPress={() => {
          // You can add a logout logic here
          // For example, navigating back to the Login screen
          navigation.navigate('Login');
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
  },
  checkText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'blue',
  },
  timerText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'green',
  },
  spacing: {
    height: 10,
  },
});
