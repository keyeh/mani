import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as firebase from 'firebase';
import 'reflect-metadata';
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'mani-ecf69.firebaseapp.com',
  databaseURL: 'https://mani-ecf69.firebaseio.com',
  projectId: 'mani-ecf69',
  storageBucket: 'mani-ecf69.appspot.com',
  messagingSenderId: '439098330706',
  appId: '1:439098330706:web:d0a85e369e136ceecc998b',
  measurementId: 'G-9XGLBLP3TT',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
