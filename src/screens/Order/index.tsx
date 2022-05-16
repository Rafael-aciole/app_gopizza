import React, { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '@hooks/auth';

import { PIZZA_TYPES } from '@utils/pizzaTypes';

import { ButtonBack } from '@components/ButtonBack';
import { RadioButton } from '@components/RadioButton';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { OrderNavigationProps, ProductNavigationProps } from '@src/@types/navigation';
import { ProductProps } from '@src/components/ProductCard';

import {
  Container,
  ContentScroll,
  Header,
  Photo,
  Sizes,
  Form,
  Title,
  Label,
  FormRow,
  InputGroup,
  Price
} from './styles'; 


type pizzaResponse = ProductProps & {
    prices_sizes: {
        [key: string]: number;
    }
} 

export function Order(){
    const navigation = useNavigation();
    const { user } = useAuth();

    const [size, setSize] = useState('');
    const [pizza, setPizza] = useState<pizzaResponse>({} as pizzaResponse);
    const [ quantity, setQuantity] = useState(0);
    const [ tableNumber, setTableNumber ] = useState('');

    const amount = size ? pizza.prices_sizes[size] * quantity : '0,00';

    const [sendingOrder, setSendingOrder] = useState(false);

    const route = useRoute();
    const { id } = route.params as ProductNavigationProps;

    function handleGoBack(){
        navigation.goBack();
    }

    function handleOrder(){
        if(!size) {
            return Alert.alert('Pedido', 'Selecione o tamanho da pizza.');
        }

        if(!tableNumber) {
            return Alert.alert('Pedido', 'Informe o número da mesa.');
        }

        if(!quantity) {
            return Alert.alert('Pedido', 'Informe a quantidade de pizzas.');
        }

        setSendingOrder(true);

        firestore()
            .collection('orders')
            .add({
                quantity,
                amount,
                pizza: pizza.name,
                size,
                table_number: tableNumber,
                status: 'Preparando',
                waiter_id: user?.id,
                image: pizza.photo_url
            })
            .then(() => navigation.navigate('Home'))
            .catch(() => {
                Alert.alert('Pedido', 'Não foi possível realizar o pedido :( ');
                setSendingOrder(false);
            });
    }

    useEffect(() => {
        if(id){
          firestore()
          .collection('pizzas')
          .doc(id)
          .get()
          .then(response => setPizza(response.data() as pizzaResponse))
          .catch(() => Alert.alert('Pedido', 'Não foi possível carregar a pizza :( '));
        }
      }, [id])

    return (
        <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ContentScroll>
                <Header>
                    <ButtonBack onPress={handleGoBack} style={{ marginBottom: 108 }} />
                </Header>

                <Photo source={{uri: pizza.photo_url }} />
                    <Form>
                        <Title>{pizza.name}</Title>
                        <Label>Selecione um Tamanho</Label>
                        <Sizes>
                        { 
                            PIZZA_TYPES.map(item => (
                                <RadioButton 
                                    key={item.id}
                                    title={item.name} 
                                    selected={size === item.id}
                                    onPress={() => setSize(item.id)}
                                />
                            ))            
                        }
                        </Sizes>

                        <FormRow>
                            <InputGroup>
                                <Label>Número da Mesa</Label>
                                <Input keyboardType="numeric" onChangeText={setTableNumber} />
                            </InputGroup>

                            <InputGroup>
                                <Label>Quantidade</Label>
                                <Input keyboardType="numeric" onChangeText={(value) => setQuantity(Number(value))} />
                            </InputGroup>               

                        </FormRow>
                        <Price>Valor de R$ {amount}</Price>

                        <Button title="Confirmar Pedido" onPress={handleOrder} isLoading={sendingOrder} />
                        

                    </Form>
                </ContentScroll>
        </Container>
    );
}