import { useState } from 'react'

import '@mantine/core/styles.css';
import { 
  MantineProvider, 
  TextInput,
  Stack, 
  Group,
  Button, 
  rem,
  Box,
  Text
} from '@mantine/core';
import { IconArrowBadgeRight } from '@tabler/icons-react';

import axios from 'axios';

import HeaderComponent from './components/Header';
import Messages from './components/Messages';

interface Part {
  name: string;
  link: string;
  partSelectNumber: string;
  manufacturerNumber: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  isInStock: boolean;
}

interface Message {
  fromClient: boolean,
  text: string,
  partList: Part[] | null,
  urlList?: string[] | null,
  titleList?: string[] | null,
}


function App() {
  const [queryValue, setQueryValue] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [questionType, setQuestionType] = useState<string>('sitemap');
  

  const handleSubmit = async () => {
    if (!queryValue.trim()) return;
    
    if (loading) return;

    console.log('Query submitted:', queryValue);

    const newMessage: Message = {
      fromClient: true,
      text: queryValue.toString(),
      partList: null,
    }
    setMessageList([...messageList, newMessage]);
    setQueryValue('');

    setLoading(true);

    try {

      let response = null;

      if (questionType === 'sitemap') {
        response = await axios.post('http://localhost:5000/sitemap_chat', {
          query: queryValue,
        });
      }
      else if (questionType === 'parts') {
        response = await axios.post('http://localhost:5000/chat', {
          query: queryValue,
        });
      }

      setLoading(false);

      if (!response || !response.data) {
        console.error('Invalid response:', response);
        return
      }

      console.log('Response:', response.data);

    if (questionType == 'parts') {
        let newPartsList: Part[] = [];
        if (response.data.parts_list) {
          console.log('Parts List:', response.data.parts_list);
          newPartsList = response.data.parts_list.map((part: any) => ({
            name: part.name,
            link: part.link,
            partSelectNumber: part['partselect-number'],
            manufacturerNumber: part['manufacturer-part-number'],
            description: part.description,
            price: part.price,
            rating: part.reviews['average-rating'],
            reviewCount: part.reviews['total-reviews'],
            image: part.image,
            isInStock: part.in_stock,
          }));
      }

      const botMessage: Message = {
        fromClient: false,
        text: response.data.response,
        partList: newPartsList || null,
      };

      setMessageList((prev) => [...prev, botMessage]);
    }

    else if (questionType == 'sitemap') {
      const botMessage: Message = {
        fromClient: false,
        text: response.data.response,
        partList: null,
        urlList: response.data.url_list,
        titleList: response.data.title_list,
      };
      setMessageList((prev) => [...prev, botMessage]);
    }
      
    } catch (error) {
      console.error('Error fetching response:', error);
      setLoading(false);
      
      const errorMessage: Message = {
        fromClient: false,
        text: 'Error: Unable to get a response. Please try again later.',
        partList: null,
      };
      setMessageList((prev) => [...prev, errorMessage]);
    }

    console.log('Message List:', messageList);
  }

  return (
    <MantineProvider
      theme={{
        fontFamily: 'Roboto, sans-serif',
      }}
    
    >
      <Stack
        style = {{
          height: '100vh',
          width: '100vw',
          alignItems: 'center',
        }}
      >
      <Stack 
      style={{
        height: '100%',
        width: '75%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Box style={{height: '15%', width: '100%', marginBottom: 'auto', marginTop: 0}}><HeaderComponent /></Box>
        <Stack style={{height: '60%', width: '100%'}}>
          <Box style={{height: '10%', width: '100%', backgroundColor: '#337778', zIndex: 5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontWeight: 700, fontSize: rem(20), padding: rem(10)}}>PartSelect AI</Text>
          </Box>
          <Messages messageList={messageList} loading={loading} questionType={questionType}/>
        </Stack>
        <Box style={{height: '10%', width: '100%'}}>
          <TextInput 
            placeholder='Ask a question...'
            value={queryValue}
            rightSection={<IconArrowBadgeRight size={30} stroke={1}/>}
            rightSectionPointerEvents='auto'
            rightSectionProps={{ 
              onClick: handleSubmit, 
              style: { cursor: 'pointer', backgroundColor: isHovered ? '#d3d3d3' : 'white' },
              onMouseEnter: () => setIsHovered(true),
              onMouseLeave: () => setIsHovered(false),
            }}
            size='xl'
            style={{fontSize: 'md'}}
            onChange={(event) => setQueryValue(event.currentTarget.value)}    
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit();
              }        
            }}
            />
        </Box>
      </Stack>
      </Stack>
    </MantineProvider>
  )
}

export default App;
