import React from 'react';
import {
    Box,
    Image,
    Text,
    VStack,
    Heading,
} from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

interface AdventureCardProps {
    adventureName: string;
    characterImage: string;
    characterName: string;
    characterJob: string;
    totalCharacters: number;
}

const CharacterCard: React.FC<AdventureCardProps> = ({
                                                         adventureName,
                                                         characterImage,
                                                         characterName,
                                                         characterJob,
                                                         totalCharacters,
                                                     }) => {
    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <Box
            bg={cardBg}
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            transition="all 0.2s"
            _hover={{transform: 'translateY(-4px)', shadow: 'lg'}}
        >
            <Image
                src={characterImage}
                alt={characterName}
                w="full"
                h="200px"
                objectFit="cover"
            />
            <VStack p={4} align="start" gap={2}>
                <Heading size="md">{adventureName}</Heading>
                <Text>
                    {characterName} ({characterJob})
                </Text>
                <Text color="gray.500">
                    명성: {totalCharacters}명
                </Text>
                <Text color="gray.500">
                    예상 화력: {totalCharacters}명
                </Text>
            </VStack>
        </Box>
    );
};

export default CharacterCard;