import React, {JSX} from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Badge,
    Table,
    HStack,
    Center,
    SimpleGrid,
    Button,
    MenuRoot,
    MenuTrigger,
    MenuContent,
    MenuItem,
} from '@chakra-ui/react';
import { LuUser, LuUserX, LuMenu, LuPen, LuTrash2 } from 'react-icons/lu';
import { useColorModeValue } from '../components/ui/color-mode';
import { colorUtils, type PartyColor, THEME } from '../styles';

interface PartyMember {
    isLeader: boolean;
    position: 'dealer' | 'buffer';
    job: string;
    characterName: string;
    fame: number;
    itemSet: string;
    itemGrade: string;
    partyColor: PartyColor;
    expectedDamage: number; // 개별 파티원 예상 데미지
}

interface Party {
    id: string;
    type: 'normal' | 'raid8' | 'raid12' | 'raid16';
    generation: number;
    members: PartyMember[];
    expectedDamage: number;
}

const PartyDetail: React.FC = () => {
    const location = useLocation();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const emptySlotBg = useColorModeValue('gray.100', 'gray.700');

    // 마이페이지 경로인지 확인
    const isMyPage = location.pathname.startsWith('/mypage');
    console.log('isMyPage', isMyPage);

    // 예시 파티 데이터
    const party: Party = {
        id: '1',
        type: 'raid8',
        generation: 1,
        members: [
            {
                isLeader: true,
                position: 'dealer',
                job: '검귀',
                characterName: '강철의검사',
                fame: 9999,
                itemSet: '신화',
                itemGrade: 'S급',
                partyColor: 'red',
                expectedDamage: 250000
            },
            {
                isLeader: false,
                position: 'buffer',
                job: '크루세이더',
                characterName: '빛의수호자',
                fame: 8888,
                itemSet: '전설',
                itemGrade: 'A급',
                partyColor: 'red',
                expectedDamage: 180000
            },
            {
                isLeader: false,
                position: 'dealer',
                job: '소울브링어',
                characterName: '어둠의지배자',
                fame: 9500,
                itemSet: '신화',
                itemGrade: 'S급',
                partyColor: 'yellow',
                expectedDamage: 320000
            },
            {
                isLeader: false,
                position: 'dealer',
                job: '버서커',
                characterName: '분노의전사',
                fame: 9200,
                itemSet: '신화',
                itemGrade: 'A급',
                partyColor: 'yellow',
                expectedDamage: 240000
            }
        ],
        expectedDamage: 990000
    };

    const maxMembers = colorUtils.getMaxMembers(party.type);

    // 수정/삭제 버튼 핸들러
    const handleEditParty = () => {
        console.log('파티 수정');
        // 파티 수정 로직
    };

    const handleDeleteParty = () => {
        console.log('파티 삭제');
        // 파티 삭제 로직
    };

    // 파티별 예상 화력 계산
    const getPartyDamageByColor = () => {
        const partyDamage: Record<string, number> = {};

        party.members.forEach(member => {
            const colorName = colorUtils.getPartyColorName(member.partyColor);
            if (!partyDamage[colorName]) {
                partyDamage[colorName] = 0;
            }
            partyDamage[colorName] += member.expectedDamage;
        });

        return partyDamage;
    };

    // 파티별로 그룹화된 테이블 행 생성
    const generateTableRows = () => {
        const rows: JSX.Element[] = [];
        const membersPerParty = party.type === 'normal' ? 4 : 4; // 모든 파티는 4명씩
        const totalParties = Math.ceil(maxMembers / membersPerParty);

        // 파티별로 그룹화
        for (let partyIndex = 0; partyIndex < totalParties; partyIndex++) {
            const startIndex = partyIndex * membersPerParty;
            const endIndex = Math.min(startIndex + membersPerParty, maxMembers);

            // 현재 파티의 색상 결정
            const partyColor = colorUtils.getPartyColorByIndex(partyIndex);

            // 현재 파티의 멤버들과 빈 슬롯들 생성
            for (let slotIndex = 0; slotIndex < membersPerParty; slotIndex++) {
                const globalIndex = startIndex + slotIndex;

                // 전체 멤버 수를 초과하지 않는 경우만 처리
                if (globalIndex < maxMembers) {
                    // 해당 슬롯에 멤버가 있는지 확인
                    const member = party.members.find(m => {
                        const memberGlobalIndex = party.members.indexOf(m);
                        return Math.floor(memberGlobalIndex / membersPerParty) === partyIndex &&
                            memberGlobalIndex % membersPerParty === slotIndex;
                    });

                    // 실제 할당된 멤버가 있는지 다시 확인 (색상 기준)
                    const actualMember = party.members.find(m => m.partyColor === partyColor);
                    const membersInThisParty = party.members.filter(m => m.partyColor === partyColor);
                    const memberInSlot = membersInThisParty[slotIndex];

                    if (memberInSlot) {
                        // 실제 파티원이 있는 경우
                        rows.push(
                            <Table.Row key={`party-${partyIndex}-slot-${slotIndex}`}>
                                <Table.Cell>
                                    <Badge background={colorUtils.getColorCode(memberInSlot.partyColor)} variant="solid">
                                        {colorUtils.getPartyColorName(memberInSlot.partyColor)}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <HStack gap={2}>
                                        {memberInSlot.isLeader && (
                                            <Badge colorScheme="purple" size="sm">공대장</Badge>
                                        )}
                                        <Badge
                                            colorScheme={memberInSlot.position === 'dealer' ? 'blue' : 'green'}
                                            size="sm"
                                        >
                                            {memberInSlot.position === 'dealer' ? '딜러' : '버퍼'}
                                        </Badge>
                                    </HStack>
                                </Table.Cell>
                                <Table.Cell>{memberInSlot.job}</Table.Cell>
                                <Table.Cell>{memberInSlot.characterName}</Table.Cell>
                                <Table.Cell>{memberInSlot.fame.toLocaleString()}</Table.Cell>
                                <Table.Cell>{memberInSlot.itemSet} ({memberInSlot.itemGrade})</Table.Cell>
                            </Table.Row>
                        );
                    } else {
                        // 빈 슬롯인 경우
                        rows.push(
                            <Table.Row key={`party-${partyIndex}-empty-${slotIndex}`}>
                                <Table.Cell>
                                    <Badge colorScheme={partyColor} variant="outline">
                                        {colorUtils.getPartyColorName(partyColor)}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <Box bg={emptySlotBg} p={2} borderRadius="md">
                                        <Center>
                                            <HStack gap={2} color="gray.500">
                                                {LuUserX({size:16})}
                                                <Text fontSize="sm">빈 자리</Text>
                                            </HStack>
                                        </Center>
                                    </Box>
                                </Table.Cell>
                                <Table.Cell>
                                    <Box bg={emptySlotBg} p={2} borderRadius="md">
                                        <Center>
                                            <Text fontSize="sm" color="gray.500">-</Text>
                                        </Center>
                                    </Box>
                                </Table.Cell>
                                <Table.Cell>
                                    <Box bg={emptySlotBg} p={2} borderRadius="md">
                                        <Center>
                                            <Text fontSize="sm" color="gray.500">-</Text>
                                        </Center>
                                    </Box>
                                </Table.Cell>
                                <Table.Cell>
                                    <Box bg={emptySlotBg} p={2} borderRadius="md">
                                        <Center>
                                            <Text fontSize="sm" color="gray.500">-</Text>
                                        </Center>
                                    </Box>
                                </Table.Cell>
                                <Table.Cell>
                                    <Box bg={emptySlotBg} p={2} borderRadius="md">
                                        <Center>
                                            <Text fontSize="sm" color="gray.500">-</Text>
                                        </Center>
                                    </Box>
                                </Table.Cell>
                            </Table.Row>
                        );
                    }
                }
            }
        }

        return rows;
    };

    const partyDamageStats = getPartyDamageByColor();

    return (
        <Box bg={bgColor} minH="100vh" py={THEME.spacing.page} padding={0}>
            <Container maxW="container.xl" padding={0}>
                <VStack gap={THEME.spacing.section} align="stretch">
                    <Box bg={cardBg} p={THEME.spacing.section} borderRadius={THEME.radii.card} shadow={THEME.shadows.card}>
                        <HStack justify="space-between" align="center" mb={4}>
                            <HStack gap={3}>
                                <Badge colorScheme={colorUtils.getPartyTypeColor(party.type)} fontSize="md" px={3} py={1}>
                                    {colorUtils.getPartyTypeLabel(party.type)}
                                </Badge>
                                <Heading size="lg">수능완성 공대</Heading>
                            </HStack>

                            {/* 마이페이지에서만 수정/삭제 버튼 표시 */}
                            {isMyPage && (
                                <MenuRoot>
                                    <MenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            colorScheme="gray"
                                        >
                                            {LuMenu({size:16})}
                                        </Button>
                                    </MenuTrigger>
                                    <MenuContent
                                        zIndex={1000}
                                        position="absolute"
                                        top="60px"
                                        right="0"
                                        mt={1}
                                    >
                                        <MenuItem onClick={handleEditParty}>
                                            <HStack gap={2}>
                                                {LuPen({size:16})}
                                                <Text>수정</Text>
                                            </HStack>
                                        </MenuItem>
                                        <MenuItem onClick={handleDeleteParty}>
                                            <HStack gap={2}>
                                                {LuTrash2({size:16})}
                                                <Text>삭제</Text>
                                            </HStack>
                                        </MenuItem>
                                    </MenuContent>
                                </MenuRoot>
                            )}
                        </HStack>

                        <Table.Root variant="outline">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>파티 구분</Table.ColumnHeader>
                                    <Table.ColumnHeader>역할</Table.ColumnHeader>
                                    <Table.ColumnHeader>직업</Table.ColumnHeader>
                                    <Table.ColumnHeader>캐릭터명</Table.ColumnHeader>
                                    <Table.ColumnHeader>명성</Table.ColumnHeader>
                                    <Table.ColumnHeader>아이템세트</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {generateTableRows()}
                            </Table.Body>
                        </Table.Root>

                        {/* 파티별 예상 화력 및 전체 통계 */}
                        <VStack gap={4} mt={6}>
                            {/* 파티별 예상 화력 */}
                            <Box w="full">
                                <Heading size="md" mb={3}>파티별 예상 화력</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
                                    {Object.entries(partyDamageStats).map(([partyName, damage]) => (
                                        <Box
                                            key={partyName}
                                            bg={cardBg}
                                            border="1px"
                                            borderColor="gray.200"
                                            p={4}
                                            borderRadius="lg"
                                            textAlign="center"
                                            _dark={{
                                                borderColor: 'gray.600'
                                            }}
                                        >
                                            <Badge
                                                background={colorUtils.getColorCode(partyName as PartyColor)}
                                                mb={2}
                                                variant="solid"
                                            >
                                                {partyName}
                                            </Badge>
                                            <Text fontSize="lg" fontWeight="bold">
                                                {damage.toLocaleString()}
                                            </Text>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </Box>

                            {/* 전체 통계 */}
                            <Box w="full">
                                <HStack justify="space-between" align="center">
                                    <Text fontSize="lg" fontWeight="bold">
                                        공대 평균 화력: {party.expectedDamage.toLocaleString()}
                                    </Text>
                                    <HStack gap={2}>
                                        {LuUser({size:16})}
                                        <Text fontSize="sm" color="gray.500">
                                            {party.members.length} / {maxMembers}명
                                        </Text>
                                    </HStack>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default PartyDetail;
