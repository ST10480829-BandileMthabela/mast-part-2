/*
This screen allows users to filter menu items by course type:

- Appetiser, Main Course, Dessert, or All Items
- Displays filtered results with image, name, price, course, description
- Updates in real-time when focus returns to screen (new items appear)
*/

/*
CODE ATTRIBUTION - Picker Component Reference
Author: The IIE
Title: Picker Component for Filtering and Selection
Date Published: 2025
Link: https://theIIE.ac.za (Educational Institution)
Date accessed: 2025
*/

/*
CODE ATTRIBUTION - React Native Picker Documentation
Author: React Native Community
Title: @react-native-picker/picker - Picker Component API
Link: https://github.com/react-native-picker/picker
Date accessed: 2025
*/

/*
CODE ATTRIBUTION - React Navigation Focus Listener
Author: React Navigation Community
Title: React Navigation - useFocusEffect and focus listener pattern
Link: https://reactnavigation.org/docs/navigation-lifecycle/
Date accessed: 2025
*/

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from './App';
import { MenuItem, getGlobalMenuItems } from './menu';

// Global variable to store all menu items for this screen
let globalMenuItems: MenuItem[] = [];

/*
 Filter Component
 Provides course-based filtering and displays filtered menu items
 WHILE LOOP: used in getFilteredItems() to filter items by course
 FOR-IN LOOP concept: map() iterates courseOptions array
 */
export default function Filter() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // State for selected course filter
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  // State for all menu items
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);

  /*
    Initialize Filter - Load Menu Items
    Fetches menu items on component mount
    Uses fallback getter if navigation params unavailable
*/
  useEffect(() => {
    const menuRoute = navigation.getState().routes.find(route => route.name === 'Menu');
    const getMenuItems = menuRoute?.params?.getMenuItems;
    
    if (getMenuItems) {
      const items = getMenuItems();
      setAllMenuItems(items);
      globalMenuItems = items;
    } else {
      // fallback to shared getter in case params were not set
      const items = getGlobalMenuItems();
      setAllMenuItems(items);
      globalMenuItems = items;
    }
  }, [navigation]);

  /*
   * Refresh on Focus
   * Reloads menu items when user returns to Filter screen
   * Ensures newly added items appear without restart
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const menuRoute = navigation.getState().routes.find(route => route.name === 'Menu');
      const getMenuItems = menuRoute?.params?.getMenuItems;
      if (getMenuItems) {
        const items = getMenuItems();
        setAllMenuItems(items);
        globalMenuItems = items;
      } else {
        const items = getGlobalMenuItems();
        setAllMenuItems(items);
        globalMenuItems = items;
      }
    });

    return unsubscribe;
  }, [navigation]);

  // Function to get filtered items based on course
  const getFilteredItems = (course: string): MenuItem[] => {
    // FOR-IN loop to iterate through items
    if (course === 'all') {
      return allMenuItems;
    }
    
    // WHILE LOOP to filter items by course
    let filteredItems: MenuItem[] = [];
    let index = 0;
    while (index < allMenuItems.length) {
      const item = allMenuItems[index];
      if (item.course.toLowerCase() === course.toLowerCase()) {
        filteredItems.push(item);
      }
      index++;
    }
    return filteredItems;
  };

  // Get filtered items based on selected course
  const filteredItems = getFilteredItems(selectedCourse);

  // Function to render each menu item card
  const renderMenuItemCard = (item: MenuItem) => {
    return (
      <TouchableOpacity key={item.id} style={styles.card}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
          </View>
          <Text style={styles.course}>{item.course}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // FOR loop to build course options
  const courseOptions = ['all', 'appetiser', 'main course', 'dessert'];
  const courseLabels: {[key: string]: string} = {
    'all': 'All Courses',
    'appetiser': 'Appetiser',
    'main course': 'Main Course',
    'dessert': 'Dessert'
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter Menu</Text>
        <Text style={styles.headerSubtitle}>Select a course to filter</Text>

        
      </View>

      <View style={styles.pickerSection}>
        <Text style={styles.pickerLabel}>Course Type:</Text>
            <View >
              <Picker
                selectedValue={selectedCourse}
                onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                itemStyle={{ fontSize: 18, color: '#333' }}
                mode='dropdown'
              >
                {courseOptions.map((course, index) => (
                  <Picker.Item 
                    key={index}
                    label={courseLabels[course]} 
                    value={course} 
                  />
                ))}
              </Picker>
            </View>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {selectedCourse === 'all' 
            ? 'All Menu Items' 
            : `${courseLabels[selectedCourse]} Items`}
        </Text>
        <Text style={styles.itemCount}>({filteredItems.length} items)</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredItems.length > 0 ? (
          <View>
            {filteredItems.map(item => renderMenuItemCard(item))}
            <View style={styles.bottomSpacing} />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No items found for this course</Text>
          </View>
        )}
      </ScrollView>

      {/* bottom nav removed - primary action placed at top for consistency */}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  pickerSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333'
  },
 
  resultsHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  itemCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 8
  },
  scrollView: {
    flex: 1
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#e0e0e0'
  },
  cardContent: {
    padding: 16
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF'
  },
  course: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
    fontWeight: '500'
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500'
  },
  bottomSpacing: {
    height: 100
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
  ,
  topActions: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
