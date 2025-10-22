import React from 'react';
import { StatusBar } from 'expo-status-bar';
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
    <ScrollView>
      <View>
        <View>
          <Text>Our Menu</Text>
          <Text>{menuItems.length} items</Text>
        </View>
        <TouchableOpacity 
         
          onPress={() => navigation.navigate('AddMenu')}
        >
          <Text >+ Add Item</Text>
        </TouchableOpacity>
      </View>
      
      {menuItems.map((dish) => (
        <TouchableOpacity key={dish.id}>
          <Image
            source={{ uri: dish.image }}
           
          />
          <View >
            <View >
              <Text >{dish.name}</Text>
              <Text>R{dish.price.toFixed(2)}</Text>
            </View>
            <Text >{dish.course}</Text>
            <Text >{dish.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <StatusBar style="auto" />
    </ScrollView>
  );
}
