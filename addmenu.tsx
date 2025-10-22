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

import { RootStackParamList } from './Splash';
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
           
          </View>

          <View >
            <Text >Image</Text>
            <TextInput
              
              placeholder="Enter image URL"
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
            />
    
          </View>

          <View >
            <TouchableOpacity 
            
              onPress={() => navigation.goBack()}
            >
              <Text >Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
             
             
            >
              <Text >Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

