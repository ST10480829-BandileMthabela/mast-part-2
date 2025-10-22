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

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
      isValid = false;
    } else if (!formData.image.startsWith('http')) {
      newErrors.image = 'Please enter a valid image URL';
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
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.title}>Add New Menu Item</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter menu item name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              placeholder="Enter menu item description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
            />
            {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course</Text>
            <View style={styles.pickerContainer}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (R)</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              placeholder="Enter price"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              keyboardType="decimal-pad"
            />
            {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image</Text>
            <TextInput
              style={[styles.input, errors.image && styles.inputError]}
              placeholder="Enter image URL"
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
            />
            {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollView: {
    flex: 1
  },
  form: {
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333'
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  inputError: {
    borderColor: '#ff3b30'
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#00a6ffff',
    borderRadius: 8,
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%'
  },
  courseOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  courseOption: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  courseOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF'
  },
  courseOptionText: {
    color: '#333'
  },
  courseOptionTextSelected: {
    color: '#fff'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginLeft: 8
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  cancelButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  }
});
