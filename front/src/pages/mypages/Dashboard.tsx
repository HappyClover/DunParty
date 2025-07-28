import React, {useState} from "react";
import {Box, Button, GridItem, Heading, HStack, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import PartyCard from "../../components/PartyCard";
import AdventureCard from "../../components/AdventureCard";
import {useColorModeValue} from "../../components/ui/color-mode";

const Dashboard: React.FC = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const sidebarBg = useColorModeValue('white', 'gray.800');

    // 예시 데이터
    const [userRaids] = useState([
        {
            id: '1',
            title: '바칼 레이드 모집',
            dungeon: '바칼 레이드',
            currentMembers: 3,
            maxMembers: 8,
            schedule: '2024-01-15 20:00',
            difficulty: 'normal' as const,
            status: 'recruiting' as const,
            description: '편하게 함께 클리어해요!',
            requirements: ['3332 이상', '딜러 우대']
        },
        {
            id: '2',
            title: '이스핀즈 하드 모집',
            dungeon: '이스핀즈',
            currentMembers: 4,
            maxMembers: 4,
            schedule: '2024-01-16 19:30',
            difficulty: 'hard' as const,
            status: 'full' as const,
            description: '숙련자만 참여 부탁드립니다.',
            requirements: ['3400 이상', '경험자만']
        },
        {
            id: '3',
            title: '카운터 사이드 모집',
            dungeon: '카운터 사이드',
            currentMembers: 2,
            maxMembers: 4,
            schedule: '2024-01-17 21:00',
            difficulty: 'expert' as const,
            status: 'recruiting' as const,
            description: '고수만 참여해주세요.',
            requirements: ['3450 이상', '경험 필수']
        },
        {
            id: '4',
            title: '오즈마 레이드',
            dungeon: '오즈마 레이드',
            currentMembers: 6,
            maxMembers: 8,
            schedule: '2024-01-18 20:30',
            difficulty: 'hard' as const,
            status: 'recruiting' as const,
            description: '즐겁게 함께해요!',
            requirements: ['3380 이상']
        }
    ]);

    const [userAdventures] = useState([
        {
            adventureName: '던파 마스터즈',
            characterImage: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Character+1',
            characterName: '강철의검사',
            characterJob: '검귀',
            totalCharacters: 5
        },
        {
            adventureName: '바칼 정복단',
            characterImage: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=Character+2',
            characterName: '화염마법사',
            characterJob: '엘레멘탈마스터',
            totalCharacters: 3
        },
        {
            adventureName: '이스핀즈 클리어',
            characterImage: 'https://via.placeholder.com/300x200/FF6347/FFFFFF?text=Character+3',
            characterName: '암살자',
            characterJob: '로그',
            totalCharacters: 7
        },
        {
            adventureName: '프로 게이머즈',
            characterImage: 'https://via.placeholder.com/300x200/9370DB/FFFFFF?text=Character+4',
            characterName: '마법사',
            characterJob: '배틀메이지',
            totalCharacters: 4
        }
    ]);

    const handleJoinParty = (partyId: string) => {
        console.log(`파티 ${partyId} 참여 신청`);
    };

    const handleViewParty = (partyId: string) => {
        console.log(`파티 ${partyId} 자세히 보기`);
    };

    const handleViewAllRaids = () => {
        console.log('모든 공격대 보기 페이지로 이동');
        // 여기에 라우팅 로직 추가
    };

    const handleViewAllAdventures = () => {
        console.log('모든 모험단 보기 페이지로 이동');
        // 여기에 라우팅 로직 추가
    };

    // 1줄에 표시할 최대 개수 (반응형)
    const getMaxItemsPerRow = () => {
        // 실제로는 현재 화면 크기에 따라 동적으로 계산하거나
        // 미디어 쿼리를 사용할 수 있지만, 여기서는 기본값 사용
        return 3; // lg 기준
    };

    const maxItemsPerRow = getMaxItemsPerRow();
    const displayedRaids = userRaids.slice(0, maxItemsPerRow);
    const displayedAdventures = userAdventures.slice(0, maxItemsPerRow);

    return (
        <GridItem>
            <VStack align="stretch" gap={8} h="full" overflowY="auto">
                {/* Created Raids Section */}
                <Box>
                    <Heading size="lg" mb={4}>내가 생성한 공격대</Heading>
                    <Box p={4} bg={sidebarBg} borderRadius="lg" shadow="md">
                        {userRaids.length > 0 ? (
                            <VStack gap={4} align="stretch">
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                                    {displayedRaids.map((raid) => (
                                        <PartyCard
                                            key={raid.id}
                                            party={raid}
                                            onJoin={handleJoinParty}
                                            onView={handleViewParty}
                                            showJoinButton={false}
                                            showViewButton={true}
                                        />
                                    ))}
                                </SimpleGrid>

                                {/* 더보기 버튼 */}
                                {userRaids.length > maxItemsPerRow && (
                                    <HStack justify="center" pt={4}>
                                        <Button
                                            variant="outline"
                                            colorScheme="blue"
                                            onClick={handleViewAllRaids}
                                        >
                                            더보기
                                        </Button>
                                    </HStack>
                                )}
                            </VStack>
                        ) : (
                            <Text>생성한 공격대 목록이 이곳에 표시됩니다.</Text>
                        )}
                    </Box>
                </Box>

                {/* Registered Adventures Section */}
                <Box>
                    <Heading size="lg" mb={4}>등록한 모험단</Heading>
                    <Box p={4} bg={sidebarBg} borderRadius="lg" shadow="md">
                        {userAdventures.length > 0 ? (
                            <VStack gap={4} align="stretch">
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                                    {displayedAdventures.map((adventure, index) => (
                                        <AdventureCard
                                            key={index}
                                            adventureName={adventure.adventureName}
                                            characterImage={adventure.characterImage}
                                            characterName={adventure.characterName}
                                            characterJob={adventure.characterJob}
                                            totalCharacters={adventure.totalCharacters}
                                        />
                                    ))}
                                </SimpleGrid>

                                {/* 더보기 버튼 */}
                                {userAdventures.length > maxItemsPerRow && (
                                    <HStack justify="center" pt={4}>
                                        <Button
                                            variant="outline"
                                            colorScheme="blue"
                                            onClick={handleViewAllAdventures}
                                        >
                                            더보기
                                        </Button>
                                    </HStack>
                                )}
                            </VStack>
                        ) : (
                            <Text>등록한 모험단 목록이 이곳에 표시됩니다.</Text>
                        )}
                    </Box>
                </Box>
            </VStack>
        </GridItem>
    )
}

export default Dashboard;
