/*
 This screen allows chefs to add new items to the menu.
 Features:
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

/**
 * FormDataItem Interface
 * Structure for temporary menu items being added
 */
interface FormDataItem {
  tempId: string;           // Temporary ID for form rows (not saved to menu)
  name: string;             // Dish name
  description: string;      // Dish description
  course: string;           // Course type: 'Appetiser', 'Main Course', 'Dessert'
  price: string;            // Price as string (sanitized before submission)
  image: string;            // Image URL
}

// Global variable for form state tracking (GLOBAL VARIABLE requirement)
let globalFormItems: FormDataItem[] = [];

/**
 * AddMenu Component
 * Allows chefs to add multiple menu items at once
 * Features: form validation, existing item management, price input sanitization
 */
export default function AddMenu() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // State for new items being added (supports multiple items)
  const [menuItemsToAdd, setMenuItemsToAdd] = useState<FormDataItem[]>([
    {
      tempId: '1',
      name: '',
      description: '',
      course: 'main course',
      price: '',
      image: '',
    }
  ]);

  // State for displaying existing menu items
  const [existingMenuItems, setExistingMenuItems] = useState<MenuItem[]>([]);
  // State for form validation errors
  const [errors, setErrors] = useState<{[key: string]: {[key: string]: string}}>({});
  // State for collapsible existing items section
  const [showExisting, setShowExisting] = useState<boolean>(false);

  /**
   * Load Existing Menu Items
   * Fetches current menu items on component mount
   */
  useEffect(() => {
    const menuRoute = navigation.getState().routes.find(route => route.name === 'Menu');
    const getMenuItems = menuRoute?.params?.getMenuItems;

    if (getMenuItems) {
      const items = getMenuItems();
      setExistingMenuItems(items);
    }
  }, [navigation]);

  /**
   * validateFormItem()
   * Validates a single form item and returns error object
   */
  const validateFormItem = (item: FormDataItem): {[key: string]: string} => {
    const newErrors: {[key: string]: string} = {};
    if (!item.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!item.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!item.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(item.price))) {
      newErrors.price = 'Price must be a number';
    }
    return newErrors;
  };

  // FOR LOOP to validate all items
  const validateAllItems = (): boolean => {
    let isValid = true;
    const newErrors: {[key: string]: {[key: string]: string}} = {};
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

  // Function to update form item field
  // Sanitize price input so dots are used for decimals and invalid characters removed
  const sanitizePriceInput = (text: string) => {
    let dotFound = false;
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch >= '0' && ch <= '9') {
        out += ch;
      } else if ((ch === '.' || ch === ',') && !dotFound) {
        // convert first comma or dot to dot
        out += '.';
        dotFound = true;
      }
      // ignore other characters
    }
    return out;
  };

  const updateFormItem = (tempId: string, field: keyof FormDataItem, value: string) => {
    const newValue = field === 'price' ? sanitizePriceInput(value) : value;
    setMenuItemsToAdd(prevItems =>
      prevItems.map(item =>
        item.tempId === tempId ? { ...item, [field]: newValue } : item
      )
    );
  };

  // Function to add new form row
  const addNewFormRow = () => {
    const lastId = parseInt(menuItemsToAdd[menuItemsToAdd.length - 1].tempId);
    const newId = (lastId + 1).toString();
    const newItem: FormDataItem = {
      tempId: newId,
      name: '',
      description: '',
      course: 'main course',
      price: '',
      image: '',
    };
    setMenuItemsToAdd([...menuItemsToAdd, newItem]);
  };

  // Function to remove form row
  const removeFormRow = (tempId: string) => {
    if (menuItemsToAdd.length === 1) {
      Alert.alert('Error', 'You must have at least one item to add.');
      return;
    }
    const updatedItems = menuItemsToAdd.filter(item => item.tempId !== tempId);
    setMenuItemsToAdd(updatedItems);
  };

  // Function to remove existing menu item
  const removeExistingItem = (itemId: string) => {
    const menuRoute = navigation.getState().routes.find(route => route.name === 'Menu');
    const removeMenuItem = menuRoute?.params?.removeMenuItem;

    if (removeMenuItem) {
      removeMenuItem(itemId);
      // Remove from local state
      setExistingMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
      Alert.alert('Success', 'Menu item removed successfully!');
    }
  };

  // WHILE LOOP to submit all items
  const handleSubmit = () => {
    if (validateAllItems()) {
      const menuRoute = navigation.getState().routes.find(route => route.name === 'Menu');
      const addMenuItem = menuRoute?.params?.addMenuItem;

      if (addMenuItem) {
        let index = 0;
        while (index < menuItemsToAdd.length) {
          const item = menuItemsToAdd[index];
          const menuItem = {
            name: item.name,
            description: item.description,
            course: item.course,
            // price input sanitized to use dot; parseFloat will work
            price: parseFloat(item.price),
            image: item.image,
          };
          addMenuItem(menuItem);
          index++;
        }

        Alert.alert(
          'Success',
          menuItemsToAdd.length + ' menu item(s) added successfully!',
          [
            {
              text: 'Add more',
              onPress: () => {
                // Reset the form so chef can add more items without leaving
                setMenuItemsToAdd([
                  {
                    tempId: '1',
                    name: '',
                    description: '',
                    course: 'main course',
                    price: '',
                    image: '',
                  }
                ]);
                setErrors({});
                globalFormItems = [];
              }
            },
            {
              text: 'Done',
              onPress: () => {
                setMenuItemsToAdd([
                  {
                    tempId: '1',
                    name: '',
                    description: '',
                    course: 'main course',
                    price: '',
                    image: '',
                  }
                ]);
                setErrors({});
                globalFormItems = [];
                navigation.navigate('Menu', {});
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error', 'Could not add menu items. Please try again.');
      }
    }
  };

  // Function to render menu item form
  const renderMenuItemForm = (item: FormDataItem) => {
    const itemErrors = errors[item.tempId] || {};
    const itemIndex = menuItemsToAdd.indexOf(item) + 1;

    return (
      <View key={item.tempId} style={styles.formCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Item {itemIndex}</Text>
          {menuItemsToAdd.length > 1 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeFormRow(item.tempId)}
            >
              <Text style={styles.deleteButtonText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, itemErrors.name && styles.inputError]}
            placeholder='Enter menu item name'
            value={item.name}
            onChangeText={(text) => updateFormItem(item.tempId, 'name', text)}
          />
          {itemErrors.name ? <Text style={styles.errorText}>{itemErrors.name}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, itemErrors.description && styles.inputError]}
            placeholder='Enter menu item description'
            value={item.description}
            onChangeText={(text) => updateFormItem(item.tempId, 'description', text)}
            multiline
            numberOfLines={3}
          />
          {itemErrors.description ? <Text style={styles.errorText}>{itemErrors.description}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={item.course}
              onValueChange={(itemValue) => updateFormItem(item.tempId, 'course', itemValue)}
            >
              <Picker.Item label='Appetiser' value='appetiser' />
              <Picker.Item label='Main Course' value='main course' />
              <Picker.Item label='Dessert' value='dessert' />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            style={[styles.input, itemErrors.price && styles.inputError]}
            placeholder='Enter price'
            value={item.price}
            onChangeText={(text) => updateFormItem(item.tempId, 'price', text)}
            keyboardType='decimal-pad'
          />
          {itemErrors.price ? <Text style={styles.errorText}>{itemErrors.price}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={[styles.input, itemErrors.image && styles.inputError]}
            placeholder='Enter image URL'
            value={item.image}
            onChangeText={(text) => updateFormItem(item.tempId, 'image', text)}
          />
          {itemErrors.image ? <Text style={styles.errorText}>{itemErrors.image}</Text> : null}
        </View>
      </View>
    );
  };

  // Function to render existing menu item
  const renderExistingMenuItem = (item: MenuItem) => {
    return (
      <View key={item.id} style={styles.existingItemCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.existingItemImage}
        />
        <View style={styles.existingItemContent}>
          <View style={styles.existingItemHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.existingItemName}>{item.name}</Text>
              <Text style={styles.existingItemCourse}>{item.course}</Text>
            </View>
            <Text style={styles.existingItemPrice}>R{item.price.toFixed(2)}</Text>
          </View>
          <Text style={styles.existingItemDescription}>{item.description}</Text>
          <TouchableOpacity
            style={styles.removeExistingButton}
            onPress={() => {
              Alert.alert(
                'Remove Item',
                `Are you sure you want to remove "${item.name}"?`,
                [
                  { text: 'Cancel', onPress: () => {} },
                  { text: 'Remove', onPress: () => removeExistingItem(item.id), style: 'destructive' }
                ]
              );
            }}
          >
            <Text style={styles.removeExistingButtonText}>Remove from Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.title}>Add & Manage Menu Items</Text>

          {/* Top action buttons: Back and Submit */}
          <View style={styles.topButtonGroup}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>BACK TO MENU</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>SUBMIT ALL</Text>
            </TouchableOpacity>
          </View>

          {/* Section for existing items */}
          {existingMenuItems.length > 0 && (
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => setShowExisting(!showExisting)}
              >
                <Text style={styles.sectionTitle}>
                   Current Menu ({existingMenuItems.length} items)
                </Text>
                <Text style={styles.toggleIcon}>{showExisting ? '' : ''}</Text>
              </TouchableOpacity>
              
              {showExisting && (
                <View style={styles.existingItemsList}>
                  {existingMenuItems.map(item => renderExistingMenuItem(item))}
                </View>
              )}
            </View>
          )}

          {/* Section for adding new items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}> Add New Items</Text>
            
            {menuItemsToAdd.map(item => renderMenuItemForm(item))}

            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={addNewFormRow}
            >
              <Text style={styles.addMoreButtonText}>+ ADD NEW ITEM</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons moved to top for easier access */}

          <View style={styles.bottomSpacing} />
        </View>
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
