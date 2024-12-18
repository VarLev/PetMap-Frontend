import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

const CustomHeader: React.FC<NativeStackHeaderProps> = ({ navigation, options, back }) => {
  return (
    <View style={styles.headerContainer}>
      {back ? (
        <TouchableOpacity onPress={navigation.goBack}>
          <Text style={styles.backButton}>{options.title || 'Назад'}</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.title}> {options.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 30, 
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  backButton: {
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 16,
    marginRight: 16
  },
  title: {
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 18,
  }
});

export default CustomHeader;
