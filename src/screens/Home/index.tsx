import React, { useState, useCallback } from 'react'; 
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import FiresTore from '@react-native-firebase/firestore';
import { useTheme } from 'styled-components/native';
import { useAuth } from '@hooks/auth';

import happyEmoji from '@assets/happy.png';

import { Searche } from '@components/Searche';
import { ProductCard, ProductProps } from '@components/ProductCard';

import {
  Container,
  Header,
  Greeting,
  GreetingEmoji,
  GreetingText,
  MenuHeader,
  MenuItemsNumber,
  MenuItemsTitle,
  NewProductButton
} from './styles'; 


export function Home(){
  const { user ,signOut } = useAuth();

  const [search, setSearch] = useState('');
  const [pizzas, setPizzas] = useState<ProductProps[]>([]);

  const navigation = useNavigation();
  const { COLORS } = useTheme();

  function fetchPizzas(value: string) {
    const formattedValue = value.toLocaleLowerCase().trim();

    FiresTore()
    .collection('pizzas')
    .orderBy('name_insensitive')
    .startAt(formattedValue)
    .endAt(`${formattedValue}\uf8ff`)
    .get()
    .then(response => {
      const data = response.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      }) as ProductProps[];

      setPizzas(data);
    })
    .catch(() => Alert.alert('Consulta', 'Não foi possível realizar a consulta'));
  }

  function handleSearch(){
    fetchPizzas(search);
  }

  function handleSearcClear(){
    setSearch('');
    fetchPizzas('');
  }

  function handleOpen(id: string){
    const route = user?.isAdmin ? 'product' : 'order';
    navigation.navigate(route, { id });
  }

  function handleAdd(){
    navigation.navigate('product', { });
  }

  useFocusEffect(
    useCallback(() => {
      fetchPizzas('');
    }, [])
  );

  return (
   <Container>
       <Header>
           <Greeting>
               <GreetingEmoji source={happyEmoji}/>
               <GreetingText>Olá, {user.name}</GreetingText>
           </Greeting>

           <TouchableOpacity onPress={signOut}>
               <MaterialIcons name="logout" color={COLORS.TITLE}  size={24} />
           </TouchableOpacity>
            
       </Header>

       <Searche
        onChangeText={setSearch} 
        value={search}
        onSearch={handleSearch} 
        onClear={handleSearcClear} 
       />
       
        <MenuHeader>
           <MenuItemsTitle>Cardápio</MenuItemsTitle>
           <MenuItemsNumber>{pizzas.length} pizzas</MenuItemsNumber>
        </MenuHeader>

        <FlatList 
          data={pizzas}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductCard 
              data={item}
              onPress={() => handleOpen(item.id)} 
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 125,
            marginHorizontal: 24
          }}
      />

    {
      user?.isAdmin &&
      <NewProductButton
        title="Cadastrar Pizza"
        type="secondary"
        onPress={handleAdd}
      />
    }

   </Container>
  );
}