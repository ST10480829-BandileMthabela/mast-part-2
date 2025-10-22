import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { RootStackParamList } from './App';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
  image: string;
}

// Initial dishes to display on startup
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
    image: 'https://th.bing.com/th/id/OIP.8No7LgYczYc66dDgftC_BwHaE8?w=251&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3',
  },
  {
    id: '3',
    name: 'French Fries',
    description: 'salted fries with tomato sauce',
    course: 'Appetiser',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJpZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },

];

export default function Menu() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(INITIAL_DISHES);

  const addMenuItem = React.useCallback((newItem: Omit<MenuItem, 'id'>) => {
    const id = (menuItems.length + 1).toString();
    setMenuItems(prevItems => [...prevItems, { ...newItem, id }]);
  }, [menuItems]);

  React.useEffect(() => {
    navigation.setParams({ addMenuItem });
  }, [navigation, addMenuItem]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Our Menu</Text>
          <Text style={styles.itemCount}>{menuItems.length} items</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddMenu')}
        >
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
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
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    addButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600'
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
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
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic'
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  }
})