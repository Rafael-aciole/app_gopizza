import React, { useState, useEffect } from 'react'; 
import { Platform, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useRoute, useNavigation } from '@react-navigation/native';

import { ProductNavigationProps } from '@src/@types/navigation';

import { ButtonBack } from '@components/ButtonBack';
import { Photo } from '@components/Photo';
import { InputPrice } from '@components/InputPrice';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ProductProps } from '@components/ProductCard';

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  Upload,
  PickImageButton,
  Form,
  Label,
  InputGroup,
  InputGroupHeader,
  MaxCharacters
} from './styles'; 

type PizzaResponse = ProductProps & {
  photo_path: string;
  prices_sizes:{
    p: string;
    m: string;
    g: string;
  }
 } 

export function Product(){
  const [ photoPath, setPhotoPath] = useState('');
  const [ image, setImage] = useState('');
  const [ name, setName] = useState('');
  const [ description, setDescription] = useState('');
  const [ prizeSizeP, setPrizeSizeP] = useState('');
  const [ prizeSizeM, setPrizeSizeM] = useState('');
  const [ prizeSizeG, setPrizeSizeG] = useState('');
  const [ isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as ProductNavigationProps;

  async function handlePickerImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4,4]
      });

      if(!result.cancelled) {
        setImage(result.uri);
      }
    }
  }

  async function handleAdd() {
    if (!name.trim()){
      Alert.alert('Cadastro', 'Informe o nome da pizza.');
    }

    if (!description.trim()){
      Alert.alert('Cadastro', 'Informe a descrição da pizza.');
    }

    if (!image){
      Alert.alert('Cadastro', 'Selecione uma imagem da pizza.');
    }

    if (!setPrizeSizeP || !setPrizeSizeM || !setPrizeSizeG){
      Alert.alert('Cadastro', 'Informe o preço de todos os tamanhos da Pizza');
    }

    setIsLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}.png`);

    await reference.putFile(image);
    const photo_url = await reference.getDownloadURL();

    firestore()
    .collection('pizzas')
    .add({
      name,
      name_insensitive: name.toLowerCase().trim(),
      description,
      prices_sizes: {
        p: prizeSizeP,
        m: prizeSizeM,
        g: prizeSizeG
      },
      photo_url,
      photo_path: reference.fullPath
    })
    .then(() => Alert.alert('Tudo certo', 'Pizza cadastrada com Sucesso :)'))
    .catch(() => Alert.alert('Erro de Cadastro', 'Não foi possível cadastrar a pizza :('))
    setIsLoading(false);
  }

  async function handleEdit() {
    
    if (!name.trim()){
      Alert.alert('Cadastro', 'Informe o nome da pizza.');
    }

    if (!description.trim()){
      Alert.alert('Cadastro', 'Informe a descrição da pizza.');
    }

    if (!image){
      Alert.alert('Cadastro', 'Selecione uma imagem da pizza.');
    }

    if (!setPrizeSizeP || !setPrizeSizeM || !setPrizeSizeG){
      Alert.alert('Cadastro', 'Informe o preço de todos os tamanhos da Pizza');
    }

    setIsLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}.png`);

    await reference.putFile(image);
    const photo_url = await reference.getDownloadURL();

    firestore()
    .collection('pizzas')
    .doc(id)
    .update({
      name: name,
      description: description,
      image: image,
      prices_sizes: {
        p: prizeSizeP,
        m: prizeSizeM,
        g: prizeSizeG
      },
      photo_url,
      photo_path: reference.fullPath
    })
    .then(() => Alert.alert('Tudo certo', 'Pizza Atualizada com Sucesso :)'))
    .catch(() => Alert.alert('Cerro de Cadastro', 'Não foi possível atualizada a pizza :('))
    setIsLoading(false);
  }

  function handleDelete(){
    firestore()
      .collection('pizzas')
      .doc(id)
      .delete()
      .then(() => {
        storage()
        .ref(photoPath)
        .delete()
        .then(() => navigation.navigate('home'));
      });
  }

  function handleGoBack(){
    navigation.goBack();
  }

  useEffect(() => {
    if(id){
      firestore()
      .collection('pizzas')
      .doc(id)
      .get()
      .then(response => {
        const product = response.data() as PizzaResponse;

        setName(product.name);
        setImage(product.photo_url);
        setDescription(product.description);
        setPrizeSizeP(product.prices_sizes.p);
        setPrizeSizeM(product.prices_sizes.m);
        setPrizeSizeG(product.prices_sizes.g);
        setPhotoPath(product.photo_path);
      })
    }
  }, [id])

  return (
   <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
     <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
            <ButtonBack onPress={handleGoBack} />

            <Title>Cadastrar</Title>
            {
              id ?
              <TouchableOpacity onPress={handleDelete}>
                  <DeleteLabel>Deletar</DeleteLabel>
              </TouchableOpacity>
              : <View style={{width: 50}} />
            }
        </Header>

        <Upload>
          <Photo uri={image} />

          <PickImageButton title="Carregar" type="secondary"  onPress={handlePickerImage}/>
        </Upload>

        <Form>
        
        <InputGroup>
          <Label>Nome:</Label>
          <Input onChangeText={setName} value={name} />
        </InputGroup>

        <InputGroup>
          <InputGroupHeader>
            <Label>Descrição:</Label>
            <MaxCharacters>0 de 60 caracteres</MaxCharacters>
          </InputGroupHeader>

          <Input 
            multiline
            maxLength={60}
            style={{height: 80}}
            onChangeText={setDescription} 
            value={description}
          />

        </InputGroup>

        <InputGroup>
          <Label>Tamanhos e Preços</Label>

          <InputPrice size="P" onChangeText={setPrizeSizeP} value={prizeSizeP} />
          <InputPrice size="M" onChangeText={setPrizeSizeM} value={prizeSizeM} />
          <InputPrice size="G" onChangeText={setPrizeSizeG} value={prizeSizeG} />
        </InputGroup>
        
        {
        id ?
        <Button onPress={handleEdit} title='Atualizar Pizza' isLoading={isLoading} /> 
        :
        <Button onPress={handleAdd} title='Cadastrar Pizza' isLoading={isLoading} />
        }
        </Form>
      </ScrollView>
   </Container>
  );
}