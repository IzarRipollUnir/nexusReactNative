import React from 'react';
import { View, Text } from 'react-native';

export default function TailwindTest() {
  return (
    <View className="bg-red-500 p-4">
      <Text className="text-white font-bold text-lg">
        Si ves esto en ROJO, Tailwind funciona!
      </Text>
      <Text className="text-yellow-300 mt-2">
        Si ves esto en AMARILLO, también funciona!
      </Text>
    </View>
  );
}
