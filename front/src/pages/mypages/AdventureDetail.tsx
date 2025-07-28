import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    SimpleGrid,
    Button,
    DialogRoot,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogCloseTrigger,
    DialogBackdrop,
    useDisclosure,
} from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { Portal } from '@chakra-ui/react';
import CharacterCard from '../../components/CharacterCard';
import CharacterSearch from '../../components/CharacterSearch';

interface AdventureDetailProps {
    adventureId?: string;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => {
    return (
        <Box
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            textAlign="center"
            bg="white"
            _dark={{ bg: "gray.700" }}
        >
            <Text fontSize="sm" color="gray.500" mb={1}>
                {label}
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
                {value}
            </Text>
        </Box>
    );
};

const AdventureDetail: React.FC<AdventureDetailProps> = ({adventureId}) => {
    const { open, onOpen, onClose } = useDisclosure();
    
    // 예시 캐릭터 데이터
    const sampleCharacters = [
        {
            adventureName: '강철의 모험단',
            characterImage: '/images/characters/warrior.jpg',
            characterName: '강철의검사',
            characterJob: '검귀',
            totalCharacters: 9999
        },
        {
            adventureName: '강철의 모험단',
            characterImage: '/images/characters/crusader.jpg',
            characterName: '빛의수호자',
            characterJob: '크루세이더',
            totalCharacters: 8888
        },
        {
            adventureName: '강철의 모험단',
            characterImage: '/images/characters/soul_bringer.jpg',
            characterName: '어둠의지배자',
            characterJob: '소울브링어',
            totalCharacters: 9500
        },
        {
            adventureName: '강철의 모험단',
            characterImage: '/images/characters/berserker.jpg',
            characterName: '분노의전사',
            characterJob: '버서커',
            totalCharacters: 9200
        }
    ];

    // 캐릭터가 있는지 확인 (데모를 위해 true로 설정, 실제로는 상태나 props로 관리)
    const hasCharacters = sampleCharacters.length > 0;

    // 역할별 통계 계산
    const dealerCount = sampleCharacters.filter(char => 
        ['검귀', '소울브링어', '버서커'].includes(char.characterJob)
    ).length;
    
    const bufferCount = sampleCharacters.filter(char => 
        ['크루세이더'].includes(char.characterJob)
    ).length;

    // 캐릭터 추가 핸들러
    const handleAddCharacter = (characterData: any) => {
        console.log('캐릭터 추가:', characterData);
        // TODO: 실제 캐릭터 추가 로직 구현
        onClose();
    };

    return (
        <>
            <Container maxW="container.xl" py={8}>
                <VStack gap={6} align="stretch">
                    <Box>
                        <HStack justify="space-between" align="center" mb={4}>
                            <Heading size="lg">강철의 모험단</Heading>
                            
                            {/* 추가하기 버튼 */}
                            <Button
                                colorScheme="blue"
                                onClick={onOpen}
                            >
                                캐릭터 추가
                            </Button>
                        </HStack>

                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                            <StatCard label="총 캐릭터" value={sampleCharacters.length} />
                            <StatCard label="딜러" value={dealerCount} />
                            <StatCard label="버퍼" value={bufferCount} />
                        </SimpleGrid>
                    </Box>

                    <Box>
                        <Heading size="md" mb={4}>등록된 캐릭터</Heading>
                        {hasCharacters ? (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
                                {sampleCharacters.map((character, index) => (
                                    <CharacterCard
                                        key={index}
                                        adventureName={character.adventureName}
                                        characterImage={character.characterImage}
                                        characterName={character.characterName}
                                        characterJob={character.characterJob}
                                        totalCharacters={character.totalCharacters}
                                    />
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Box borderWidth="1px" borderRadius="lg" p={4}>
                                <Text>등록된 캐릭터가 없습니다.</Text>
                            </Box>
                        )}
                    </Box>
                </VStack>
            </Container>

            {/* 캐릭터 추가 모달 */}
            <Portal>
                <DialogRoot 
                    open={open} 
                    onOpenChange={(details: { open: boolean }) => !details.open && onClose()}
                    size="xl"
                >
                    <DialogBackdrop />
                    <DialogContent
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 9999,
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>
                                캐릭터 추가
                            </DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <VStack gap={4} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                    모험단에 추가할 캐릭터를 검색하세요.
                                </Text>
                                
                                {/* CharacterSearch 컴포넌트 */}
                                <Box>
                                    <CharacterSearch />
                                </Box>
                            </VStack>
                        </DialogBody>
                        <DialogFooter>
                            <HStack gap={2}>
                                <DialogCloseTrigger asChild>
                                    <Button variant="outline">
                                        취소
                                    </Button>
                                </DialogCloseTrigger>
                                <Button 
                                    colorScheme="blue"
                                    onClick={() => handleAddCharacter({})}
                                >
                                    추가
                                </Button>
                            </HStack>
                        </DialogFooter>
                        <DialogCloseTrigger />
                    </DialogContent>
                </DialogRoot>
            </Portal>
        </>
    );
};

export default AdventureDetail;