import React, { useState } from 'react'; 
import { KeyboardAvoidingView, Platform } from 'react-native';
import LottieView from 'lottie-react-native';


import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { useAuth } from '@hooks/auth';

import brandImg from '@assets/brand.png';
import loadAnimation from '@assets/pizza-process.json';
 
import {
  Container,
  Content,
  Title,
  Brand,
  ForgotPasswordButton,
  ForgotPasswordLabel
} from './styles'; 

export function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { signIn, isLogging, forgotPassword } = useAuth();

  function handleSignIn() {
    signIn(email, password);
  }

  function handleForgoPassword(){
    forgotPassword(email);
  }

  return (
   <Container>
     <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
       <Content>  
        
          <Brand>
            <LottieView 
                source={loadAnimation}
                autoPlay
                loop                
              />
            </Brand>
          <Title>Login</Title>
          

          <Input 
            placeholder="E-mail"
            type='primary'
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setEmail}
          />

          <Input 
            placeholder="Senha"
            type='primary'
            secureTextEntry
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setPassword}
          />

          <ForgotPasswordButton onPress={handleForgoPassword}>
            <ForgotPasswordLabel>Esqueci Minha Senha</ForgotPasswordLabel>
          </ForgotPasswordButton>

          <Button title='Entrar' type='secondary' onPress={handleSignIn} isLoading={isLogging} />
        </Content>
    </KeyboardAvoidingView>
   </Container>
  );
}