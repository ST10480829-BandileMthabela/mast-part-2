/*
Screen use: allows chefs to add new items to the menu.

- Add multiple items in a single session
- View and manage existing menu items
- Edit item details: name, description, course, price, image URL
- Validate all fields before submission
- Continue adding or return to menu after submission
*/

/*
CODE ATTRIBUTION - Conditional Logic Reference
Author: The IIE
Title: Conditional Statements (if statement)
Date Published: 2025
Link: https://theIIE.ac.za (Educational Institution)
Date accessed: 2025
*/

/*
CODE ATTRIBUTION - Picker Component Documentation
Author: Easy Learning (YouTube)
Title: 131 - The Picker Component in React Native
Date Published: 2025
Link: https://www.youtube.com/results?search_query=react+native+picker+component
Date accessed: 2025
*/

/*
CODE ATTRIBUTION - React Native Form Handling
Author: React Native Community
Title: React Native - TextInput & Form Patterns
Link: https://reactnative.dev/docs/textinput
Date accessed: 2025
*/

/*
CODE ATTRIBUTION - React Hooks Reference
Author: React Documentation
Title: Hooks API Reference - useState, useEffect
Link: https://react.dev/reference/react
Date accessed: 2025
*/

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { Picker } from '@react-native-picker/picker';
import { MenuItem } from './menu';
// global variable requirement
let globalFormItems: FormDataItem[] = [];

export default function AddMenu() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddMenu'>>();

  const [menuItemsToAdd, setMenuItemsToAdd] = useState<FormDataItem[]>([
    { tempId: '1', name: '', description: '', course: 'Main Course', price: '', image: '' },
  ]);
  const [existingMenuItems, setExistingMenuItems] = useState<MenuItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [showExisting, setShowExisting] = useState<boolean>(false);

  useEffect(() => {
    // Try to get existing menu items from route params or fallback global
    const menuRoute = navigation.getState().routes.find(route => route.name === 'Menu');
    const getMenuItems = menuRoute?.params?.getMenuItems;

    if (getMenuItems) {
      const items = getMenuItems();
      setExistingMenuItems(items);
    } else {
      const items = getGlobalMenuItems();
      setExistingMenuItems(items);
    }
  }, [navigation]);

  const validateFormItem = (item: FormDataItem): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};
    if (!item.name.trim()) newErrors.name = 'Name is required';
    if (!item.description.trim()) newErrors.description = 'Description is required';
    if (!item.price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(item.price))) newErrors.price = 'Price must be numeric';
    return newErrors;
  };

  const validateAllItems = (): boolean => {
    let isValid = true;
    const newErrors: { [key: string]: { [key: string]: string } } = {};
    for (let i = 0; i < menuItemsToAdd.length; i++) {
      const itemErrors = validateFormItem(menuItemsToAdd[i]);
      if (Object.keys(itemErrors).length > 0) {
        newErrors[menuItemsToAdd[i].tempId] = itemErrors;
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const sanitizePriceInput = (text: string) => {
    let dotFound = false;
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch >= '0' && ch <= '9') out += ch;
      else if (ch === '.' && !dotFound) {
        out += ch;
        dotFound = true;
      }
    }
    return out;
  };

  const handleAddNewFormRow = () => {
    const newItem: FormDataItem = {
      tempId: String(Date.now()),
      name: '',
      description: '',
      course: 'Main Course',
      price: '',
      image: '',
    };
    setMenuItemsToAdd(prev => [...prev, newItem]);
  };

  const handleInputChange = (id: string, field: keyof FormDataItem, value: string) => {
    setMenuItemsToAdd(prev =>
      prev.map(item => (item.tempId === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = () => {
    if (!validateAllItems()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly.');
      return;
    }

    // Safely get addMenuItem or fallback to global function
    const menuRoute = navigation.getState().routes.find(route => route.name === 'Menu');
    const addMenuItem = menuRoute?.params?.addMenuItem;

    if (!addMenuItem) {
      Alert.alert('Error', 'Unable to access menu functions. Please try again.');
      return;
    }

    menuItemsToAdd.forEach(item => {
      addMenuItem({
        name: item.name,
        description: item.description,
        course: item.course,
        price: Number(item.price),
        image: item.image,
      });
    });

    Alert.alert('Success', 'Menu item(s) added successfully!', [
      {
        text: 'Add another',
        onPress: () => {
          setMenuItemsToAdd([{ tempId: '1', name: '', description: '', course: 'Main Course', price: '', image: '' }]);
          setErrors({});
          globalFormItems = [];
        },
      },
      {
        text: 'Done',
        onPress: () => {
          setMenuItemsToAdd([{ tempId: '1', name: '', description: '', course: 'Main Course', price: '', image: '' }]);
          setErrors({});
          globalFormItems = [];
          navigation.navigate('Menu'); // ✅ fixed: no params reset
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView>
        <Text style={styles.title}>Add Menu Item</Text>

        {menuItemsToAdd.map((item, index) => (
          <View key={item.tempId} style={styles.card}>
            <Text style={styles.label}>Dish Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter dish name"
              value={item.name}
              onChangeText={text => handleInputChange(item.tempId, 'name', text)}
            />
            {errors[item.tempId]?.name && <Text style={styles.error}>{errors[item.tempId].name}</Text>}

            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              value={item.description}
              onChangeText={text => handleInputChange(item.tempId, 'description', text)}
            />
            {errors[item.tempId]?.description && <Text style={styles.error}>{errors[item.tempId].description}</Text>}

            <Text style={styles.label}>Course:</Text>
            <Picker
              selectedValue={item.course}
              onValueChange={value => handleInputChange(item.tempId, 'course', value)}
            >
              <Picker.Item label="Appetiser" value="Appetiser" />
              <Picker.Item label="Main Course" value="Main Course" />
              <Picker.Item label="Dessert" value="Dessert" />
            </Picker>

            <Text style={styles.label}>Price (R):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              keyboardType="numeric"
              value={item.price}
              onChangeText={text => handleInputChange(item.tempId, 'price', sanitizePriceInput(text))}
            />
            {errors[item.tempId]?.price && <Text style={styles.error}>{errors[item.tempId].price}</Text>}

            <Text style={styles.label}>Image URL:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              value={item.image}
              onChangeText={text => handleInputChange(item.tempId, 'image', text)}
            />

            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.previewImage} />
            ) : null}
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddNewFormRow}>
          <Text style={styles.addButtonText}>+ Add Another Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit All Items</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowExisting(!showExisting)}
        >
          <Text style={styles.toggleButtonText}>
            {showExisting ? 'Hide Current Menu' : 'View Current Menu'}
          </Text>
        </TouchableOpacity>

        {showExisting && (
          <View>
            <Text style={styles.sectionTitle}>Current Menu</Text>
            {existingMenuItems.map((item, index) => (
              <View key={item.id} style={styles.existingItemCard}>
                <Image source={{ uri: item.image }} style={styles.existingImage} />
                <Text style={styles.existingText}>{item.name} - R{item.price.toFixed(2)}</Text>
                <Text style={styles.existingText}>{item.course}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1
  },
  form: {
    padding: 16,
    paddingBottom: 40
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333'
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  toggleIcon: {
    fontSize: 14,
    color: '#666'
  },
  existingItemsList: {
    padding: 12
  },
  existingItemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden'
  },
  existingItemImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0'
  },
  existingItemContent: {
    padding: 12
  },
  existingItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  existingItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  existingItemCourse: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  existingItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#007AFF'
  },
  existingItemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 16
  },
  removeExistingButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  removeExistingButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  formCard: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600'
  },
  inputGroup: {
    marginBottom: 12
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#fff'
  },
  inputError: {
    borderColor: '#ff3b30'
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 11,
    marginTop: 3
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  addMoreButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 12
  },
  addMoreButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // gap not supported consistently; spacing handled with margins
    gap: 10,
    marginTop: 20
  },
  topButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10
  },
  submitButton: {
    backgroundColor: '#4d9418',
    borderRadius: 6,
    padding: 13,
    flex: 1
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600'
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 13,
    flex: 1,
    borderWidth: 1,
    borderColor: '#ff0000'
  },
  cancelButtonText: {
    color: '#ff0000',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600'
  },
  bottomSpacing: {
    height: 20
  }
});
