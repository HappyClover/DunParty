import React, {useState} from 'react';
import {
    Box,
    Input,
    Button,
    VStack,
    HStack,
    Container,
    Select, SimpleGrid,
} from '@chakra-ui/react';
import {THEME} from "../styles";
import CharacterCard from "./CharacterCard";

const CharacterSearch: React.FC = () => {
    const [server, setServer] = useState<string>('');
    const [characterName, setCharacterName] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = () => {
        // TODO: Implement search logic
    };

    const handleServerChange = (details: { value: string[] }) => {
        if (details.value.length > 0) {
            setServer(details.value[0]);
        }
    };

    const handleCharacterNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharacterName(e.target.value);
    };

    return (
        <Container maxW={THEME.sizes.maxContainerWidth}>
            <VStack gap={4} align="stretch">
                <HStack gap={4}>
                    <Select.Root 
                        value={server ? [server] : []}
                        onValueChange={handleServerChange}
                        positioning={{ placement: "bottom-start" }}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="서버 선택" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                            <Select.Content>
                                <Select.Item item="server1">
                                    <Select.ItemText>서버 1</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="server2">
                                    <Select.ItemText>서버 2</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="server3">
                                    <Select.ItemText>서버 3</Select.ItemText>
                                </Select.Item>
                            </Select.Content>
                        </Select.Positioner>
                    </Select.Root>

                    <Input
                        placeholder="캐릭터명 입력"
                        value={characterName}
                        onChange={handleCharacterNameChange}
                    />
                    <Button onClick={handleSearch}>검색</Button>
                </HStack>

                <Box mt={4}>
                    <VStack gap={4} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                            <CharacterCard adventureName={"EBS수능방송"} characterImage={""} characterName={"수능방송수2A"} characterJob={"진 런처"} totalCharacters={75001} />
                        </SimpleGrid>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default CharacterSearch;