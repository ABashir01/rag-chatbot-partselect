import React from 'react';
import { Box, Mark, Text, Anchor, Stack, Loader, Group } from '@mantine/core';
import Markdown from 'react-markdown';

import PartsList from './Parts';

interface Message {
    fromClient: boolean;
    text: string;
    partList: Part[] | null;
    urlList?: string[] | null;
    titleList?: string[] | null;
  }

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

interface MessagesProps {
    messageList: Message[];
    loading: boolean;
    questionType: string;
  }

const Messages: React.FC<MessagesProps> = ({ messageList, loading, questionType }) => {
    return (
        <Box style={{ height: '85%', width: '100%', overflowY: 'auto', padding: '10px', border: '1px solid #d3d3d3' }}>
        {messageList.map((message, index) => (
            console.log('message:', message),
            <Stack>
            <Box
            key={index}
            style={{
                backgroundColor: message.fromClient ? '#F3C04C' : '#337778',
                color: message.fromClient ? '#121212' : '#FFFFFF',
                padding: '15px',
                borderRadius: '10px',
                maxWidth: '60%',
                margin: message.fromClient ? '0 0 10px auto' : '0 auto 10px 0',
            }}
            >
            <Text size="md">
                <Markdown
                    components={{
                        a: ({ href, children }) => (
                            <Anchor
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'underline' }}
                            >
                                {children}
                            </Anchor>
                        ),
                        img: () => null
                    }}

                >

                    {message.text}


                </Markdown>
            </Text>
            <Text size="md">
                <Markdown
                    components={{
                        a: ({ href, children }) => (
                            <Anchor
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'underline' }}
                            >
                                {children}
                            </Anchor>
                        ),
                        img: () => null
                    }}

                >

                    {questionType == "sitemap" && !message.fromClient ? message.urlList?.map((url, index) => (
                        "- [" + message.titleList![index] + "](" + url + ")"
                    )).join("\n") : null}


                </Markdown>
            </Text>
            </Box>
           
            {message.partList && message.partList.length > 0 && (
                <Stack>
                    <Text fw={'700'}>
                        Relevant Parts:
                    </Text>
                    <PartsList partsList={message.partList} />
                </Stack>
            )}
            </Stack>
        ))}

        {loading && (
            <Box style={{
                backgroundColor: '#337778',
                color: '#FFFFFF',
                padding: '15px',
                borderRadius: '10px',
                maxWidth: '60%',
                margin: '0 auto 10px 0',
            }}>
                <Group justify='space-between'>
                    <Text>
                        {questionType == "parts" ? "Searching for parts..." : "Thinking..."}
                    </Text>
                    <Loader color='#FFFFFF'/>
                </Group>
                
            </Box>
        )}
        </Box>
    )
}

export default Messages;


