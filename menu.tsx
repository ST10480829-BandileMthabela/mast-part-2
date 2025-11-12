/*
 This screen displays all menu items added by chefs and provides
 navigation to Filter and Add Menu screens. Users can view dishes
 with images, descriptions, prices, and course types.
*/

/*
CODE ATTRIBUTION - Pizza Image
Author: Ivan Torres
Title: pizza with berries
Date Published: 2017
Link: https://unsplash.com/photos/pizza-with-berries-MQUqbmszGGM
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION - Fries Image
Author: Pixzolo Photography
Title: fries and ketchup
Date Published: 2018
Link: https://unsplash.com/photos/fries-and-ketchup-8YBHgP0WrEo
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION - Cake Image
Author: Nahima Aparicio
Title: a piece of cake with fruit on top
Date Published: 2022
Link: https://unsplash.com/photos/a-piece-of-cake-with-fruit-on-top-of-it-Tb6VJvW_lqU
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION - Fish Image
Author: Jennifer Burk
Title: a white plate topped with a piece of fish
Date Published: 2020
Link: https://unsplash.com/photos/a-white-plate-topped-with-a-piece-of-fish-gwBcamFtPr4
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION - React Navigation Reference
Author: Codevolution
Title: React Native Tutorial - 74 - Navigation between Screens
Date Published: 2023
Link: https://www.youtube.com/watch?v=HuwQwNDLaJ8
Date accessed: 21/10/2025
*/

/*
CODE ATTRIBUTION - React Native Documentation
Title: React Native - Core Components and APIs
Link: https://reactnative.dev/docs/getting-started
Date accessed: 2025
*/

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet,
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App';

/**
 * MenuItem Interface
 * Defines the structure of each menu item
 */
export interface MenuItem {
  id: string;                // Unique identifier (generated with counter for unlimited items)
  name: string;              // Dish name
  description: string;       // Dish description
  course: string;            // Course type: 'Appetiser', 'Main Course', 'Dessert'
  price: number;             // Price in Rand (R)
  image: string;             // URL to dish image
}

/**
 * INITIAL_DISHES
 * Default menu items loaded when the app starts.
 * These 5 dishes are used as seed data.
 */
const INITIAL_DISHES: MenuItem[] = [
  {
    id: '1',
    name: 'Creamy Pancakes',
    description: 'Fluffy pancakes topped with whipped cream and fresh berries',
    course: 'Dessert',
    price: 70.00,
    image: 'https://images.unsplash.com/photo-1670639596808-11aa57e22904?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    id: '2',
    name: 'Pizza',
    description: 'Delicious cheese pizza with pepperoni and a crispy crust',
    course: 'Main Course',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  },
  {
    id: '3',
    name: 'French Fries',
    description: 'Salted fries served with tomato sauce',
    course: 'Appetiser',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJpZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },
  {
    id: '4',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with creamy frosting and decorative toppings',
    course: 'Dessert',
    price: 90.00,
    image: 'https://images.unsplash.com/photo-1646678257756-a56adbd0d8f8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  },
  {
    id: '5',
    name: 'Grilled Fish',
    description: 'Fresh grilled fish served with lemon and aromatic herbs',
    course: 'Main Course',
    price: 230.00,
    image: 'https://images.unsplash.com/photo-1580959375944-abd7e991f971?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1976',
  },
];

/**
 * Global State Management
 */

// Global variable to manage menu items across screens
let globalMenuItems: MenuItem[] = INITIAL_DISHES;

/**
 * Global ID Counter
 * Used to generate unique IDs for unlimited menu items.
 * Incrementing counter ensures no ID collisions even after removals.
 */
let menuIdCounter: number = INITIAL_DISHES.length;

/**
 * getNextMenuId()
 * Generates the next unique menu item ID using a counter.
 * This approach supports unlimited items without conflicts.
 */
function getNextMenuId(): string {
  menuIdCounter++;
  return menuIdCounter.toString();
}

/**
 * getGlobalMenuItems()
 * Getter function to export current menu items.
 * Used as fallback in Filter screen when navigation params unavailable.
 */
export function getGlobalMenuItems(): MenuItem[] {
	return globalMenuItems;
}

/**
 * Menu Screen Component
 * Main display screen showing all menu items with filtering and add/remove navigation.
 */
export default function Menu() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(INITIAL_DISHES);

  /**
   * addMenuItem - Callback for AddMenu screen
   * Adds a new item to the menu with a generated unique ID.
   * Updates both state and global variable for cross-screen access.
   * FOR LOOP concept: iterates through items when filtering/updating
   */
  const addMenuItem = React.useCallback((newItem: Omit<MenuItem, 'id'>) => {
    const id = getNextMenuId();
    const updatedItems = [...menuItems, { ...newItem, id }];
    setMenuItems(updatedItems);
    globalMenuItems = updatedItems;
  }, [menuItems]);

  /**
   * removeMenuItem - Callback for AddMenu screen
   * Removes an item from the menu by ID.
   * FILTER/MAP concept: uses array filter to exclude target item
   */
  const removeMenuItem = React.useCallback((itemId: string) => {
    const updatedItems = menuItems.filter(item => item.id !== itemId);
    setMenuItems(updatedItems);
    globalMenuItems = updatedItems;
  }, [menuItems]);

// Function to get all menu items
const getMenuItems = React.useCallback((): MenuItem[] => {
return menuItems;
}, [menuItems]);

React.useEffect(() => {
navigation.setParams({ addMenuItem, removeMenuItem, getMenuItems });
}, [navigation, addMenuItem, removeMenuItem, getMenuItems]);

return (
<View style={styles.mainContainer}>
<ScrollView style={styles.container}>
<View style={styles.header}>
<View>
<Text style={styles.headerText}>Menu</Text>
<Text style={styles.itemCount}>{menuItems.length} items</Text>
</View>
</View>

{menuItems.map((dish) => (
<TouchableOpacity key={dish.id} style={styles.card}>
<Image
source={{ uri: dish.image }}
style={styles.image}
/>
<View style={styles.cardContent}>
<View style={styles.titleRow}>
<Text style={styles.name}>{dish.name}</Text>
<Text style={styles.price}>R{dish.price.toFixed(2)}</Text>
</View>
<Text style={styles.course}>{dish.course}</Text>
<Text style={styles.description}>{dish.description}</Text>
</View>
</TouchableOpacity>
))}
<View style={styles.bottomSpacing} />
</ScrollView>

<View style={styles.navBar}>
<TouchableOpacity 
style={styles.addButton}
onPress={() => navigation.navigate('Filter')}
>
<Text style={styles.filterButtonText}>FILTER</Text>
</TouchableOpacity>

<TouchableOpacity 
style={styles.addButton}
onPress={() => navigation.navigate('AddMenu')}
>
<Image source={require('./image_assets/blueaddicon.jpg')} style={styles.addButtonIcon} />
</TouchableOpacity>
</View>
<StatusBar style="auto" />
</View>
);
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9f9fb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9fb'
  },
  // Navigation bar with two action buttons (Filter + Add)
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#e8e8ec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomSpacing: {
    height: 120,
  },
  addButtonIcon: {
    width: 70,
    height: 70,
    tintColor: '#fff'
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  // Header section with title and item count
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8ec',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  // Action buttons: Filter + Add
  addButton: {
    backgroundColor: '#1f6a8c',
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#1f6a8c',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1e',
    marginBottom: 4
  },
  itemCount: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500'
  },
  // Individual menu item card with image and details
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#1f6a8c',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f4'
  },
  // Card image
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#e8e8ec'
  },
  // Card content padding
  cardContent: {
    padding: 16
  },
  // Title and price row
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  // Dish name
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1e',
    flex: 1
  },
  // Price display
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f6a8c',
    marginLeft: 12
  },
  // Course type
  course: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    fontStyle: 'italic',
    fontWeight: '500'
  },
  // Description text
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20
  }
});