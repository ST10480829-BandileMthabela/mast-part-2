
/*CODE ATTRIBUTION*/

/*
Author: The IIE
Title: if statement
Date Published: 2025
Link: https://theIIE.ac.za 
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION 
Author: Net Ninja
Title: TypeScript Tutorial #4 - Objects & Arrays
Date Published: 2020
Link: https://www.youtube.com/watch?v=157NopQ-chU
Date accessed: 13/11/2025
*/

/*
CODE ATTRIBUTION 
Author: Code Garden
Title: 6 NEW ES2023 Array Methods with React + TypeScript Examples
Date Published: 2023
Link: https://www.youtube.com/watch?v=_4M46HRHoIw
Date accessed: 13/11/2025
*/


/*
CODE ATTRIBUTION 
Author: Moreality
Title: Touchable Opacity Made Easy with React Native [In 9 Minutes] - 2022
Date Published: 2022
Link: https://www.youtube.com/watch?v=XeSxz_6vS04
Date accessed: 13/11/2025
*/

/*
Author: Easy Learning 
Title: 131 - The Picker Component in React Native
Date Published: 2025
Link: https://www.youtube.com/watch?v=dSY6HJc7CXE&t=115s
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION 
Author: The IIE
Title: Picker Component for Filtering and Selection
Date Published: 2025
Link: https://theIIE.ac.za (Educational Institution)
Date accessed: 2025
*/

/*
CODE ATTRIBUTION 
Author: Venom Kage
Title: How to use “useFocusEffect” hook in react native
Date Published: 2023
Link: https://www.youtube.com/watch?v=5oSIifNdckw&embeds_referring_euri=https%3A%2F%2Fchatgpt.com%2F&source_ve_path=Mjg2NjY
Date accessed: 13/11/2025
*/

/*new screen

1. has a picker
2. uses a while loop to filter items based on course.
3. Uses a for-in loop to show picker items.
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


export default function Filter() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // State for selected course filter
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  // State for all menu items
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
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
  }, [navigation]);

  //new items are visable
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

  // Function filters items based on course they are
  const getFilteredItems = (course: string): MenuItem[] => {
    // going through items
    if (course === 'all') {
      return allMenuItems;
    }
    
    // Filter items by course.
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

  // Get filtered items based on selected course.
  const filteredItems = getFilteredItems(selectedCourse);

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

  // For loop to display course options.
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
