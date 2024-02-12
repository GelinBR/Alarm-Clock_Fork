import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { textStyles, styles } from '../styles/styles';
import { Audio } from 'expo-av';



//import alarm_sound from "../assets/cringy_alarm_sound1.wav"

//import { Notifications } from 'expo';
//import * as Permissions from 'expo-permissions';

function AlarmClock() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [alarmTime, setAlarmTime] = useState(null);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
    const [countdown, setCountdown] = useState('');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~  New Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const [sound, setSound] = useState();

    async function playSound() { // Sound works as long as PHONE IS NOT ON VIBRATE
        try {
            //console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(require('../assets/cringy_alarm_sound1.wav'));
            setSound(sound);

            //console.log('Playing Sound');
            await sound.playAsync();
        } catch (error) {
            console.error('Error loading or playing sound for alarm:', error.message);
        }
    }

    const stopSound = async () => { // Stops repeats, but since it only runs 1 sound cycle its pretty useless rn.
        try {
            if (sound) {
                console.log('Stopping Sound');
                await sound.stopAsync();
                await sound.unloadAsync(); 
                setSound(null); 
            }
        } catch (error) {
            console.error('Error stopping sound:', error.message);
        }
    };
   
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~  New Code END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setAlarmTime(date);
    setIsAlarmSet(true);

    // Set a timeout to trigger the alarm
    const currentTime = new Date();
    const timeUntilAlarm = date - currentTime;
    setTimeout(() => {
        playSound();
        Alert.alert('Wake up!', 'Time to wake up!', [{ text: 'Dismiss', onPress: stopSound }]);
        setIsAlarmSet(false);
        setCountdown('');
    }, timeUntilAlarm);

    // Start updating the countdown every second
    const intervalId = setInterval(() => {
      const remainingTime = date - new Date();
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        setCountdown('');
      } else {
        const minutes = Math.floor(remainingTime / 60000);
        const formatMinutes = String(minutes).padStart(2, '0');
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        const formatSeconds = String(seconds).padStart(2, '0');
        setCountdown(`${formatMinutes} min : ${formatSeconds} sec`);
      }
    }, 1000);

    hideDatePicker();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Alarm Status: {isAlarmSet ? 'Set' : 'Not Set'}</Text>
      {isAlarmSet && <Text>Time Left: {countdown}</Text>}
      <TouchableOpacity onPress={showDatePicker} style={styles.button}>
        <Text style={textStyles.buttonText}>Set Alarm Time</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        textColor="black"
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

export default AlarmClock;
