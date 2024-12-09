import React from 'react';
import { Box, Text, Image, Button, Group, Anchor } from '@mantine/core';

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

interface PartsListProps {
  partsList: Part[];
}

const PartsList: React.FC<PartsListProps> = ({ partsList }) => {
  return (
    <Box
      style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '20px',
        padding: '10px',
        marginBottom: '10px',
      }}
    >
      {partsList.map((part, index) => (
        <Box
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'row',
            border: '1px solid #d3d3d3',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: 'white',
            minWidth: '50%',
            maxWidth: '50%',
            width: '50%',
          }}
        >
          <Box style={{ flex: '1', paddingRight: '10px' }}>
            <Image
              src={part.image}
              alt={part.name}
              height={120}
              width="100%"
              style={{ objectFit: 'contain' }}
            />
          </Box>

          <Box style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Anchor
              fw={700}
              size="lg"
              href={part.link}
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: '#337778', textDecoration: 'none'}}
            >
              {part.name}
            </Anchor>

            <Group gap="2">
              <Text size="sm">
                {Array.from({ length: 5 }).map((_, idx) =>
                  idx < Math.ceil(part.rating) ? '⭐' : '☆'
                )}
              </Text>
              <Text size="sm">
                ({part.reviewCount})
              </Text>
            </Group>

            <Text size="sm">
              <strong>PartSelect #: </strong>
              {part.partSelectNumber}
            </Text>
            <Text size="sm">
              <strong>Manufacturer #: </strong>
              {part.manufacturerNumber}
            </Text>

            <Text size="sm" lineClamp={2}>
              {part.description}
            </Text>

            <Box>
              <Text fw={700} size="xl" color="#121212">
                ${part.price.toFixed(2)}
              </Text>
              {part.isInStock ? (
                <Text size="md" color="#337778">
                  ✅ In Stock
                </Text>
              ) : (
                <Text size="md" color="#AA1E00">
                  ❌ Out of Stock
                </Text>
              )}
            </Box>

            <Button
              size="sm"
              variant="filled"
              color="#F3C04C"
              style={{ color: '#121212', alignSelf: 'flex-start' }}
            >
              Add to cart
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PartsList;
