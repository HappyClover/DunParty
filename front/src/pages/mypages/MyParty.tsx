import React, {useState} from "react";
import {
    Box,
    Button,
    GridItem,
    Heading,
    HStack,
    SimpleGrid,
    Text,
    VStack,
    Badge,
    Grid,
    Collapsible,
    Checkbox,
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogCloseTrigger,
    DialogBackdrop,
    useDisclosure,
} from "@chakra-ui/react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { Portal } from '@chakra-ui/react';
import PartyCard from "../../components/PartyCard";
import {useColorModeValue} from "../../components/ui/color-mode";

// 필터 옵션 타입 정의
interface FilterOptions {
    raids: string[];
    legionDungeons: string[];
    advancedDungeons: string[];
    roles: string[];
}

// 필터 옵션 데이터
const filterConfig = {
    raids: [
        { value: 'nabel-hard', label: '나벨 하드' },
        { value: 'nabel-normal', label: '나벨 일반' },
        { value: 'misty-hard', label: '안개신 하드' }
    ],
    legionDungeons: [
        { value: 'venus-descent', label: '베누스 강림' },
        { value: 'venus-stage2', label: '베누스 2단계' },
        { value: 'venus-stage1', label: '베누스 1단계' }
    ],
    advancedDungeons: [
        { value: 'death-goddess', label: '죽음의여신전' },
        { value: 'azure-main', label: '애주어메인' },
        { value: 'moonlit-lake', label: '달이잠긴호수' }
    ],
    roles: [
        { value: 'leader', label: '공대장(파티장)' },
        { value: 'member', label: '공대원(파티원)' }
    ]
};

const MyParty: React.FC = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const sidebarBg = useColorModeValue('white', 'gray.800');
    const filterBg = useColorModeValue('gray.100', 'gray.700');

    // 모달 상태 관리
    const { open, onOpen, onClose } = useDisclosure();

    // 필터 접기/펼치기 상태
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // 필터 상태
    const [filters, setFilters] = useState<FilterOptions>({
        raids: [],
        legionDungeons: [],
        advancedDungeons: [],
        roles: []
    });

    // 예시 데이터 - 실제로는 dungeon 타입과 role 정보가 있어야 함
    const [userRaids] = useState([
        {
            id: '1',
            title: '바칼 레이드 모집',
            dungeon: '바칼 레이드',
            dungeonType: 'raids',
            dungeonCode: 'nabel-hard',
            currentMembers: 3,
            maxMembers: 8,
            schedule: '2024-01-15 20:00',
            difficulty: 'normal' as const,
            status: 'recruiting' as const,
            description: '편하게 함께 클리어해요!',
            requirements: ['3332 이상', '딜러 우대'],
            role: 'leader' as const // 공대장 여부
        },
        {
            id: '2',
            title: '이스핀즈 하드 모집',
            dungeon: '이스핀즈',
            dungeonType: 'raids',
            dungeonCode: 'nabel-normal',
            currentMembers: 4,
            maxMembers: 4,
            schedule: '2024-01-16 19:30',
            difficulty: 'hard' as const,
            status: 'full' as const,
            description: '숙련자만 참여 부탁드립니다.',
            requirements: ['3400 이상', '경험자만'],
            role: 'member' as const
        },
        {
            id: '3',
            title: '베누스 강림 모집',
            dungeon: '베누스 강림',
            dungeonType: 'legionDungeons',
            dungeonCode: 'venus-descent',
            currentMembers: 2,
            maxMembers: 4,
            schedule: '2024-01-17 21:00',
            difficulty: 'expert' as const,
            status: 'recruiting' as const,
            description: '고수만 참여해주세요.',
            requirements: ['3450 이상', '경험 필수'],
            role: 'leader' as const
        },
        {
            id: '4',
            title: '죽음의여신전 파티',
            dungeon: '죽음의여신전',
            dungeonType: 'advancedDungeons',
            dungeonCode: 'death-goddess',
            currentMembers: 6,
            maxMembers: 8,
            schedule: '2024-01-18 20:30',
            difficulty: 'hard' as const,
            status: 'recruiting' as const,
            description: '즐겁게 함께해요!',
            requirements: ['3380 이상'],
            role: 'member' as const
        }
    ]);

    // 확인하지 않은 공대 데이터 (예시)
    const [unconfirmedParties] = useState([
        {
            id: 'uc-1',
            title: '바칼 레이드 신청 승인 대기',
            dungeon: '바칼 레이드',
            currentMembers: 7,
            maxMembers: 8,
            schedule: '오늘 20:00',
            difficulty: 'normal' as const,
            status: 'recruiting' as const,
            description: '공대장이 아직 승인하지 않았습니다.',
            requirements: ['명성 9000+', '딜러 우대']
        },
        {
            id: 'uc-2',
            title: '시로코 하드 참여 요청',
            dungeon: '시로코 레이드',
            currentMembers: 11,
            maxMembers: 12,
            schedule: '내일 19:30',
            difficulty: 'hard' as const,
            status: 'recruiting' as const,
            description: '마지막 한 자리! 빠른 승인 필요합니다.',
            requirements: ['명성 12000+', '경험자만']
        },
        {
            id: 'uc-3',
            title: '이스핀즈 급구',
            dungeon: '이스핀즈',
            currentMembers: 3,
            maxMembers: 4,
            schedule: '지금 바로',
            difficulty: 'normal' as const,
            status: 'recruiting' as const,
            description: '한 분만 더 오시면 바로 시작합니다!',
            requirements: ['명성 8000+']
        }
    ]);

    // 확인하지 않은 공대 신청 개수
    const unconfirmedCount = unconfirmedParties.length;

    // 필터링된 공격대 목록
    const getFilteredRaids = () => {
        return userRaids.filter(raid => {
            const { raids, legionDungeons, advancedDungeons, roles } = filters;

            // 모든 필터가 비어있으면 전체 표시
            if (raids.length === 0 && legionDungeons.length === 0 &&
                advancedDungeons.length === 0 && roles.length === 0) {
                return true;
            }

            // 던전 타입별 필터링
            const dungeonMatch = (
                (raids.length === 0 || (raid.dungeonType === 'raids' && raids.includes(raid.dungeonCode))) ||
                (legionDungeons.length === 0 || (raid.dungeonType === 'legionDungeons' && legionDungeons.includes(raid.dungeonCode))) ||
                (advancedDungeons.length === 0 || (raid.dungeonType === 'advancedDungeons' && advancedDungeons.includes(raid.dungeonCode)))
            );

            // 역할 필터링
            const roleMatch = roles.length === 0 || roles.includes(raid.role);

            return dungeonMatch && roleMatch;
        });
    };

    // 전체 선택/해제 핸들러
    const handleSelectAll = (category: keyof FilterOptions, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            [category]: checked ? filterConfig[category].map(item => item.value) : []
        }));
    };

    // 개별 체크박스 핸들러
    const handleFilterChange = (category: keyof FilterOptions, value: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            [category]: checked
                ? [...prev[category], value]
                : prev[category].filter(item => item !== value)
        }));
    };

    // 필터 초기화
    const handleResetFilters = () => {
        setFilters({
            raids: [],
            legionDungeons: [],
            advancedDungeons: [],
            roles: []
        });
    };

    const handleJoinParty = (partyId: string) => {
        console.log(`파티 ${partyId} 참여 신청`);
    };

    const handleViewParty = (partyId: string) => {
        console.log(`파티 ${partyId} 자세히 보기`);
    };

    const handleCreateParty = () => {
        console.log('공격대 생성 페이지로 이동');
    };

    const handleUnconfirmedParties = () => {
        console.log('확인하지 않은 공대 목록 보기');
        onOpen(); // 모달 열기
    };

    // 확인하지 않은 공대 승인 처리
    const handleApproveParty = (partyId: string) => {
        console.log(`공대 ${partyId} 승인`);
        // TODO: 실제 승인 로직 구현
    };

    // 확인하지 않은 공대 거절 처리
    const handleRejectParty = (partyId: string) => {
        console.log(`공대 ${partyId} 거절`);
        // TODO: 실제 거절 로직 구현
    };

    const filteredRaids = getFilteredRaids();

    return (
        <>
            <GridItem>
                <VStack align="stretch" gap={6} h="full" overflowY="auto">
                    {/* 헤더 영역 */}
                    <HStack justify="space-between" align="center" h={50}>
                        <Heading size="lg">내 공격대</Heading>
                        <HStack gap={3}>
                            <Button
                                variant="outline"
                                colorScheme="orange"
                                size="sm"
                                position="relative"
                                onClick={handleUnconfirmedParties}
                            >
                                확인하지 않은 내 공대
                                {unconfirmedCount > 0 && (
                                    <Badge
                                        colorScheme="red"
                                        variant="solid"
                                        borderRadius="full"
                                        position="absolute"
                                        top="-8px"
                                        right="-8px"
                                        minW="20px"
                                        h="20px"
                                        fontSize="xs"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {unconfirmedCount}
                                    </Badge>
                                )}
                            </Button>
                            <Button
                                colorScheme="blue"
                                size="sm"
                                onClick={handleCreateParty}
                            >
                                생성하기
                            </Button>
                        </HStack>
                    </HStack>

                    {/* 필터 영역 */}
                    <Box bg={filterBg} p={4} borderRadius="lg" shadow="sm">
                        <VStack align="stretch" gap={4}>
                            {/* 필터 토글 버튼 */}
                            <HStack justify="space-between" align="center">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    size="sm"
                                >
                                    <HStack>
                                        <Text>필터 {isFilterOpen ? '접기' : '펼치기'}</Text>
                                        <Box>{isFilterOpen ? LuChevronUp({}) : LuChevronDown({})}</Box>

                                    </HStack>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetFilters}
                                >
                                    초기화
                                </Button>
                            </HStack>

                            {/* 필터 옵션들 */}
                            <Collapsible.Root open={isFilterOpen}>
                                <Collapsible.Content>
                                    <VStack align="stretch" gap={4} pt={2}>
                                        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
                                            {/* 레이드 필터 */}
                                            <Box>
                                                <VStack align="stretch" gap={2}>
                                                    <HStack>
                                                        {/* 전체 선택 체크박스 */}
                                                        <Checkbox.Root
                                                            checked={filters.raids.length === filterConfig.raids.length}
                                                            indeterminate={filters.raids.length > 0 && filters.raids.length < filterConfig.raids.length}
                                                            onCheckedChange={(details: { checked: boolean; }) => handleSelectAll('raids', details.checked)}
                                                        >
                                                            <Checkbox.HiddenInput />
                                                            <Checkbox.Control />
                                                            <Checkbox.Label>
                                                                <Text fontWeight="semibold">레이드</Text>
                                                            </Checkbox.Label>
                                                        </Checkbox.Root>


                                                    </HStack>
                                                    <VStack align="stretch" gap={1} pl={6}>
                                                        {/* 개별 체크박스들 */}
                                                        {filterConfig.raids.map((option) => (
                                                            <Checkbox.Root
                                                                key={option.value}
                                                                checked={filters.raids.includes(option.value)}
                                                                onCheckedChange={(details: { checked: boolean; }) => handleFilterChange('raids', option.value, details.checked)}
                                                                size="sm"
                                                            >
                                                                <Checkbox.HiddenInput />
                                                                <Checkbox.Control />
                                                                <Checkbox.Label>{option.label}</Checkbox.Label>
                                                            </Checkbox.Root>
                                                        ))}
                                                    </VStack>
                                                </VStack>
                                            </Box>

                                            {/* 레기온던전 필터 */}
                                            <Box>
                                                <VStack align="stretch" gap={2}>
                                                    <HStack>
                                                        <Checkbox.Root
                                                            checked={filters.legionDungeons.length === filterConfig.legionDungeons.length}
                                                            indeterminate={filters.legionDungeons.length > 0 && filters.legionDungeons.length < filterConfig.legionDungeons.length}
                                                            onCheckedChange={(details: { checked: boolean; }) => handleSelectAll('legionDungeons', details.checked)}
                                                        >
                                                            <Checkbox.HiddenInput />
                                                            <Checkbox.Control />
                                                            <Checkbox.Label>
                                                                <Text fontWeight="semibold">레기온던전</Text>
                                                            </Checkbox.Label>
                                                        </Checkbox.Root>
                                                    </HStack>
                                                    <VStack align="stretch" gap={1} pl={6}>
                                                        {/* 레기온던전 개별 체크박스 - 카테고리 수정 */}
                                                        {filterConfig.legionDungeons.map((option) => (
                                                            <Checkbox.Root
                                                                key={option.value}
                                                                checked={filters.legionDungeons.includes(option.value)}
                                                                onCheckedChange={(details: { checked: boolean; }) => handleFilterChange('legionDungeons', option.value, details.checked)}
                                                                size="sm"
                                                            >
                                                                <Checkbox.HiddenInput />
                                                                <Checkbox.Control />
                                                                <Checkbox.Label>{option.label}</Checkbox.Label>
                                                            </Checkbox.Root>
                                                        ))}
                                                    </VStack>
                                                </VStack>
                                            </Box>

                                            {/* 상급던전 필터 */}
                                            <Box>
                                                <VStack align="stretch" gap={2}>
                                                    <HStack>
                                                        <Checkbox.Root
                                                            checked={filters.advancedDungeons.length === filterConfig.advancedDungeons.length}
                                                            indeterminate={filters.advancedDungeons.length > 0 && filters.advancedDungeons.length < filterConfig.advancedDungeons.length}
                                                            onCheckedChange={(details: { checked: boolean; }) => handleSelectAll('advancedDungeons', details.checked)}
                                                        >
                                                            <Checkbox.HiddenInput />
                                                            <Checkbox.Control />
                                                            <Checkbox.Label>
                                                                <Text fontWeight="semibold">상급던전</Text>
                                                            </Checkbox.Label>
                                                        </Checkbox.Root>
                                                    </HStack>
                                                    <VStack align="stretch" gap={1} pl={6}>
                                                        {/* 상급던전 개별 체크박스 - 카테고리 수정 */}
                                                        {filterConfig.advancedDungeons.map((option) => (
                                                            <Checkbox.Root
                                                                key={option.value}
                                                                checked={filters.advancedDungeons.includes(option.value)}
                                                                onCheckedChange={(details: { checked: boolean; }) => handleFilterChange('advancedDungeons', option.value, details.checked)}
                                                                size="sm"
                                                            >
                                                                <Checkbox.HiddenInput />
                                                                <Checkbox.Control />
                                                                <Checkbox.Label>{option.label}</Checkbox.Label>
                                                            </Checkbox.Root>
                                                        ))}
                                                    </VStack>
                                                </VStack>
                                            </Box>

                                            {/* 내 역할 필터 */}
                                            <Box>
                                                <VStack align="stretch" gap={2}>
                                                    <HStack>
                                                        <Checkbox.Root
                                                            checked={filters.roles.length === filterConfig.roles.length}
                                                            indeterminate={filters.roles.length > 0 && filters.roles.length < filterConfig.roles.length}
                                                            onCheckedChange={(details: { checked: boolean; }) => handleSelectAll('roles', details.checked)}
                                                        >
                                                            <Checkbox.HiddenInput />
                                                            <Checkbox.Control />
                                                            <Checkbox.Label>
                                                                <Text fontWeight="semibold">내 역할</Text>
                                                            </Checkbox.Label>
                                                        </Checkbox.Root>
                                                    </HStack>
                                                    <VStack align="stretch" gap={1} pl={6}>
                                                        {/* 내 역할 개별 체크박스 - 카테고리 수정 */}
                                                        {filterConfig.roles.map((option) => (
                                                            <Checkbox.Root
                                                                key={option.value}
                                                                checked={filters.roles.includes(option.value)}
                                                                onCheckedChange={(details: { checked: boolean; }) => handleFilterChange('roles', option.value, details.checked)}
                                                                size="sm"
                                                            >
                                                                <Checkbox.HiddenInput />
                                                                <Checkbox.Control />
                                                                <Checkbox.Label>{option.label}</Checkbox.Label>
                                                            </Checkbox.Root>
                                                        ))}
                                                    </VStack>
                                                </VStack>
                                            </Box>
                                        </Grid>
                                    </VStack>
                                </Collapsible.Content>
                            </Collapsible.Root>
                        </VStack>
                    </Box>

                    {/* 공격대 목록 */}
                    <Box>
                        <Box p={4} bg={sidebarBg} borderRadius="lg" shadow="md">
                            {filteredRaids.length > 0 ? (
                                <VStack gap={4} align="stretch">
                                    <Text fontSize="sm" color="gray.500">
                                        {filteredRaids.length}개의 공격대가 표시됩니다.
                                    </Text>
                                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                                        {filteredRaids.map((raid) => (
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
                                </VStack>
                            ) : (
                                <VStack gap={4} align="center" py={8}>
                                    <Text color="gray.500">
                                        {userRaids.length === 0
                                            ? '생성한 공격대 목록이 이곳에 표시됩니다.'
                                            : '선택한 필터에 맞는 공격대가 없습니다.'
                                        }
                                    </Text>
                                    {userRaids.length === 0 && (
                                        <Button
                                            colorScheme="blue"
                                            onClick={handleCreateParty}
                                        >
                                            첫 번째 공격대 생성하기
                                        </Button>
                                    )}
                                </VStack>
                            )}
                        </Box>
                    </Box>
                </VStack>
            </GridItem>

            {/* 확인하지 않은 공대 모달 */}
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
                                확인하지 않은 내 공대
                            </DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <VStack gap={4} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                    승인 대기 중인 공대 신청 목록입니다.
                                </Text>
                                
                                {unconfirmedParties.length > 0 ? (
                                    <>
                                        <Text mb={2} fontSize="md" fontWeight="semibold">
                                            총 {unconfirmedParties.length}개의 대기 중인 신청
                                        </Text>
                                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                            {unconfirmedParties.map((party) => (
                                                <PartyCard
                                                    key={party.id}
                                                    party={party}
                                                    onJoin={handleApproveParty}
                                                    onView={handleViewParty}
                                                    showJoinButton={true}
                                                    showViewButton={true}
                                                />
                                            ))}
                                        </SimpleGrid>
                                    </>
                                ) : (
                                    <Box textAlign="center" py={8}>
                                        <Text color="gray.500">
                                            확인하지 않은 공대 신청이 없습니다.
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        </DialogBody>
                        <DialogFooter>
                            <HStack gap={2}>
                                <DialogCloseTrigger asChild>
                                    <Button variant="outline">
                                        닫기
                                    </Button>
                                </DialogCloseTrigger>
                            </HStack>
                        </DialogFooter>
                        <DialogCloseTrigger />
                    </DialogContent>
                </DialogRoot>
            </Portal>
        </>
    )
}

export default MyParty;