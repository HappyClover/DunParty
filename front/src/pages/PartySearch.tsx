import React, { useState } from 'react';
import {
    Box,
    Container,
    Select,
    Input,
    Text,
    SimpleGrid,
    Center
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import PartyCard, { PartyData } from '../components/PartyCard';
import { THEME } from "../styles";

interface SearchParams {
    query: string;
    category: string;
}

const PartySearch: React.FC = () => {
    const location = useLocation();
    const searchParams = location.state as SearchParams;
    const [category, setCategory] = useState(searchParams?.category || '');

    // 예시 파티 데이터
    const sampleParties: PartyData[] = [
        {
            id: '1',
            title: '바칼 노말 8인 구인합니다',
            dungeon: '바칼 레이드',
            currentMembers: 6,
            maxMembers: 8,
            schedule: '오늘 20:00',
            difficulty: 'normal',
            status: 'recruiting',
            description: '편안하게 클리어 목표입니다. 초보자 환영!',
            requirements: ['명성 9000+', '딜러 선호']
        },
        {
            id: '2',
            title: '시로코 하드 레이드팟',
            dungeon: '시로코 레이드',
            currentMembers: 12,
            maxMembers: 12,
            schedule: '내일 19:30',
            difficulty: 'hard',
            status: 'full',
            description: '숙련자만 모집, 빠른 클리어 예정',
            requirements: ['명성 12000+', '경험자만', '딜컷 필수']
        },
        {
            id: '3',
            title: '이스핀즈 노말 쉬워요~',
            dungeon: '이스핀즈',
            currentMembers: 3,
            maxMembers: 4,
            schedule: '지금 바로',
            difficulty: 'normal',
            status: 'recruiting',
            description: '가볍게 클리어하실 분들 구해요',
            requirements: ['명성 8000+']
        },
        {
            id: '4',
            title: '백화점 엑스퍼트 도전!',
            dungeon: '백화점',
            currentMembers: 2,
            maxMembers: 4,
            schedule: '주말 14:00',
            difficulty: 'expert',
            status: 'recruiting',
            description: '도전적인 난이도! 함께 정복해보아요',
            requirements: ['명성 11000+', '고딜러만', '버퍼 필수']
        },
        {
            id: '5',
            title: '거북이 섬 파밍팟',
            dungeon: '거북이 섬',
            currentMembers: 4,
            maxMembers: 4,
            schedule: '매일 21:00',
            difficulty: 'easy',
            status: 'closed',
            description: '정기 파밍팟입니다',
            requirements: ['성실한 분만']
        },
        {
            id: '6',
            title: '안톤 레이드 신규 환영',
            dungeon: '안톤 레이드',
            currentMembers: 5,
            maxMembers: 8,
            schedule: '오늘 22:00',
            difficulty: 'normal',
            status: 'recruiting',
            description: '신규분들도 환영합니다. 차근차근 설명해드려요!',
            requirements: ['명성 7000+', '의지만 있으면 OK']
        }
    ];

    const handleCategoryChange = (details: { value: string[] }) => {
        if (details.value.length > 0) {
            setCategory(details.value[0]);
        }
    };

    // 파티 참여 핸들러
    const handleJoinParty = (partyId: string) => {
        console.log('파티 참여:', partyId);
        // TODO: 실제 파티 참여 로직 구현
    };

    // 파티 상세보기 핸들러
    const handleViewParty = (partyId: string) => {
        console.log('파티 상세보기:', partyId);
        // TODO: 파티 상세 페이지로 이동
    };

    // 검색 결과가 있는지 확인 (데모를 위해 true로 설정)
    const hasResults = sampleParties.length > 0;

    return (
        <Box>
            <Header/>
            <Container maxW={THEME.sizes.maxContainerWidth} py={THEME.spacing.page}>
                <Box mb={THEME.spacing.section}>
                    <Select.Root
                        value={category ? [category] : []}
                        onValueChange={handleCategoryChange}
                        positioning={{ placement: "bottom-start" }}
                    >
                        <Select.HiddenSelect />
                        <Select.Control mb={4}>
                            <Select.Trigger>
                                <Select.ValueText placeholder="카테고리 선택" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                            <Select.Content>
                                <Select.Item item="all">
                                    <Select.ItemText>전체</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="raid">
                                    <Select.ItemText>레이드</Select.ItemText>
                                </Select.Item>
                                <Select.Item item="dungeon">
                                    <Select.ItemText>던전</Select.ItemText>
                                </Select.Item>
                            </Select.Content>
                        </Select.Positioner>
                    </Select.Root>
                    <Input
                        placeholder="파티 검색"
                        defaultValue={searchParams?.query}
                    />
                </Box>

                {/* Search Results */}
                <Box>
                    {hasResults ? (
                        <>
                            <Text mb={4} fontSize="lg" fontWeight="semibold">
                                총 {sampleParties.length}개의 파티를 찾았습니다
                            </Text>
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={THEME.spacing.card}>
                                {sampleParties.map((party) => (
                                    <PartyCard
                                        key={party.id}
                                        party={party}
                                        onJoin={handleJoinParty}
                                        onView={handleViewParty}
                                        showJoinButton={true}
                                        showViewButton={true}
                                    />
                                ))}
                            </SimpleGrid>
                        </>
                    ) : (
                        <Center py={10}>
                            <Text>검색 결과가 없습니다.</Text>
                        </Center>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default PartySearch;