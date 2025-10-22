import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { RootStackParamList } from './App';
import { Picker } from '@react-native-picker/picker';

export default function AddMenu() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    course: 'main course',
    price: '',
    image: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      description: '',
      price: '',
      image: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
      isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const menuRoute = navigation.getState().routes.find(route => route.name === 'Menu');
      const addMenuItem = menuRoute?.params?.addMenuItem;

      if (addMenuItem) {
        // Convert price string to number
        const menuItem = {
          name: formData.name,
          description: formData.description,
          course: formData.course,
          price: parseFloat(formData.price),
          image: formData.image,
        };

        addMenuItem(menuItem);
        
        // Show quick success message
        Alert.alert('Success', 'Menu item added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Clear form data
              setFormData({
                name: '',
                description: '',
                course: 'main course',
                price: '',
                image: '',
              });
              // Navigate back to Menu screen
              navigation.navigate('Menu', {});
            }
          }
        ]);
      } else {
        // Handle the case where addMenuItem is not available
        Alert.alert('Error', 'Could not add menu item. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  
    >
      <ScrollView >
        <View >
          <Text>Add New Menu Item</Text>

          <View>
            <Text>Name</Text>
            <TextInput
             
              placeholder="Enter menu item name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            {errors.name ? <Text >{errors.name}</Text> : null}
          </View>

          <View >
            <Text >Description</Text>
            <TextInput
             
              placeholder="Enter menu item description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
            />
            {errors.description ? <Text >{errors.description}</Text> : null}
          </View>

          <View >
            <Text >Course</Text>
            <View >
              <Picker
                selectedValue={formData.course}
                onValueChange={(itemValue) => setFormData({ ...formData, course: itemValue })}
                
              >
                <Picker.Item label="Appetiser" value="appetiser" />
                <Picker.Item label="Main Course" value="main course" />
                <Picker.Item label="Dessert" value="dessert" />
              </Picker>
            </View>
          </View>

          <View>
            <Text>Price (R)</Text>
            <TextInput
             
              placeholder="Enter price"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              keyboardType="decimal-pad"
            />
            {errors.price ? <Text >{errors.price}</Text> : null}
          </View>

          <View >
            <Text >Image</Text>
            <TextInput
              
              placeholder="Enter image URL"
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
            />
            {errors.image ? <Text >{errors.image}</Text> : null}
          </View>

          <View >
            <TouchableOpacity 
            
              onPress={() => navigation.goBack()}
            >
              <Text >Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
             
              onPress={handleSubmit}
            >
              <Text >Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

