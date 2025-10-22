import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { RootStackParamList } from './Splash';

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
    price: 69.00,
    image: 'https://images.unsplash.com/photo-1670639596808-11aa57e22904?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    id: '2',
    name: 'Pizza',
    description: 'Delicious cheese pizza with pepperoni and a crispy crust',
    course: 'Main Course',
    price: 79.99,
    image: '',
  },
  {
    id: '3',
    name: 'French Fries',
    description: 'salted fries with tomato sauce',
    course: 'Appetiser',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1598679253544-2c97992403ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
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
        <Text style={styles.headerText}>Our Menu</Text>
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
    color: '#333'
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