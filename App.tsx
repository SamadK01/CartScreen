import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import products, { Product } from './src/data';

export interface CartItem extends Product {
  quantity: number;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const addToCart = (product: Product) => {
    const productExists = cart.find(item => item.id === product.id);
    if (productExists) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
    setSelectedIds(selectedIds.filter(id => id !== productId));
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const deleteSelectedItems = () => {
    setCart(cart.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  const getTotalPrice = (): number => {
    return cart.reduce((acc, item) => {
      // Calculate the discount if any
      const discountMultiplier = item.discount ? (100 - item.discount) / 100 : 1;
      // Apply the discount to the price
      const discountedPrice = item.price * discountMultiplier;
      // Accumulate the total
      return acc + discountedPrice * item.quantity;
    }, 0);
  };

  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart ({totalItemsInCart})</Text>
        <TouchableOpacity onPress={deleteSelectedItems} style={styles.deleteButton}>
          <MaterialCommunityIcons name="delete" size={25} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList<Product>
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => toggleSelection(item.id)}
              style={[
                styles.checkboxContainer,
                { backgroundColor: selectedIds.includes(item.id) ? '#FF612F' : 'white' }
              ]}
            >
              <Text style={[
                selectedIds.includes(item.id) ? styles.checkboxChecked : styles.checkboxUnchecked
              ]}>
                ✓
              </Text>
            </TouchableOpacity>
            <Image source={item.image} style={styles.image} />
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
                {item.discount && <Text style={styles.discountText}>{item.discount}% Discount</Text>}
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.quantityButton}>
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}</Text>
                <TouchableOpacity onPress={() => addToCart(item)} style={styles.quantityButton}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${getTotalPrice()}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout ({selectedIds.length})</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#FF612F',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  headerTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4
  },
  checkboxContainer: {
    marginRight: 15,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF612F',
    borderRadius: 14,
    backgroundColor: 'white'
  },
  checkboxChecked: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20
  },
  checkboxUnchecked: {
    fontSize: 14,
    color: 'transparent',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 20
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0E1722',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E1722',
  },
  discountText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FF6347',
    marginTop: 4
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityButton: {
    backgroundColor: '#F6F6F6',
    borderRadius: 30,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'black',
    fontSize: 16
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  checkoutButton: {
    backgroundColor: '#FF612F',
    padding: 10,
    borderRadius: 5
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16
  }
});