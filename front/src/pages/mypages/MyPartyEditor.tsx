import React, {useState, useEffect, JSX} from 'react';
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
    Input,
    Checkbox,
    Grid,
    GridItem,
    Select,
} from '@chakra-ui/react';
import { LuUser, LuUserX, LuSave, LuX, LuTrash2 } from 'react-icons/lu';
import { useColorModeValue } from '../../components/ui/color-mode';
import { colorUtils, type PartyColor, THEME } from '../../styles';
import { Portal } from '@chakra-ui/react';
import CharacterSearch from "../../components/CharacterSearch";

interface PartyMember {
    id: string;
    isLeader: boolean;
    position: 'dealer' | 'buffer';
    job: string;
    characterName: string;
    fame: number;
    itemSet: string;
    itemGrade: string;
    partyColor: PartyColor;
    expectedDamage: number;
}

interface Party {
    id: string;
    title: string; // 공대명 추가
    type: 'normal' | 'raid8' | 'raid12' | 'raid16';
    generation: number;
    content: string; // 컨텐츠 추가
    difficulty: 'easy' | 'normal' | 'hard' | 'expert'; // 난이도 추가
    isSearchable: boolean; // 검색가능 여부
    isPrivate: boolean; // 비공개 여부
    members: PartyMember[];
    expectedDamage: number;
}

interface DraggedMember {
    member: PartyMember;
    sourceIndex: number;
}

// 컨텐츠 옵션
const contentOptions = [
    { value: 'bakal', label: '바칼 레이드' },
    { value: 'ispins', label: '이스핀즈' },
    { value: 'nabel', label: '나벨베루스' },
    { value: 'misty', label: '안개의 신' },
    { value: 'venus', label: '베누스' },
    { value: 'death-goddess', label: '죽음의여신전' },
    { value: 'azure', label: '애주어메인' },
    { value: 'moonlit', label: '달이잠긴호수' },
];

// 난이도 옵션
const difficultyOptions = [
    { value: 'easy', label: '쉬움' },
    { value: 'normal', label: '보통' },
    { value: 'hard', label: '어려움' },
    { value: 'expert', label: '전문가' },
];

const MyPartyEditor: React.FC = () => {
    const location = useLocation();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const emptySlotBg = useColorModeValue('gray.100', 'gray.700');
    const emptySlotHoverBg = useColorModeValue('gray.200', 'gray.600'); // 추가
    const editmodeBg1 = useColorModeValue('blue.50', 'blue.900');
    const editmodeBg2 = useColorModeValue('black.100', 'black.700');
    const { open, onOpen, onClose } = useDisclosure();


    // 마이페이지 경로인지 확인
    const isMyPage = location.pathname.startsWith('/mypage');
    const isEditMode = location.pathname.includes('/editor') || location.pathname.includes('/edit');

    // 드래그 상태
    const [draggedMember, setDraggedMember] = useState<DraggedMember | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ partyIndex: number; slotIndex: number } | null>(null);

    // 파티 데이터 상태
    const [party, setParty] = useState<Party>({
        id: '1',
        title: '수능완성 공대',
        type: 'raid8',
        generation: 1,
        content: 'bakal',
        difficulty: 'normal',
        isSearchable: true,
        isPrivate: false,
        members: [
            {
                id: '1',
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
                id: '2',
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
                id: '3',
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
                id: '4',
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
        expectedDamage: 0
    });

    const maxMembers = colorUtils.getMaxMembers(party.type);

    // 파티 화력 자동 계산
    useEffect(() => {
        const totalDamage = party.members.reduce((sum, member) => sum + member.expectedDamage, 0);
        setParty(prev => ({ ...prev, expectedDamage: totalDamage }));
    }, [party.members]);

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

    // 입력 필드 변경 핸들러들
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParty(prev => ({ ...prev, title: e.target.value }));
    };

    const handleContentChange = (details: { value: string[] }) => {
        if (details.value.length > 0) {
            setParty(prev => ({ ...prev, content: details.value[0] }));
        }
    };

    const handleDifficultyChange = (details: { value: string[] }) => {
        if (details.value.length > 0) {
            setParty(prev => ({ ...prev, difficulty: details.value[0] as Party['difficulty'] }));
        }
    };

    const handleSearchableChange = (checked: boolean) => {
        setParty(prev => ({ ...prev, isSearchable: checked }));
    };

    const handlePrivateChange = (checked: boolean) => {
        setParty(prev => ({ ...prev, isPrivate: checked }));
    };

    // 드래그 시작
    const handleDragStart = (member: PartyMember, sourceIndex: number) => {
        if (!isEditMode) return;
        setDraggedMember({ member, sourceIndex });
    };

    // 드래그 오버
    const handleDragOver = (e: React.DragEvent) => {
        if (!isEditMode) return;
        e.preventDefault();
    };

    // 드롭
    const handleDrop = (targetPartyIndex: number, targetSlotIndex: number) => {
        if (!isEditMode || !draggedMember) return;

        const targetPartyColor = colorUtils.getPartyColorByIndex(targetPartyIndex);
        const updatedMembers = [...party.members];

        // 기존 위치에서 멤버 제거
        updatedMembers.splice(draggedMember.sourceIndex, 1);

        // 새로운 파티 색상으로 업데이트
        const updatedMember = {
            ...draggedMember.member,
            partyColor: targetPartyColor
        };

        // 해당 파티의 적절한 위치에 삽입
        const targetPartyMembers = updatedMembers.filter(m => m.partyColor === targetPartyColor);
        const insertIndex = Math.min(targetSlotIndex, targetPartyMembers.length);

        // 전체 배열에서 삽입할 위치 계산
        let globalInsertIndex = 0;
        for (let i = 0; i < updatedMembers.length; i++) {
            if (updatedMembers[i].partyColor === targetPartyColor) {
                if (targetPartyMembers.indexOf(updatedMembers[i]) === insertIndex) {
                    globalInsertIndex = i;
                    break;
                }
            }
        }

        updatedMembers.splice(globalInsertIndex, 0, updatedMember);

        setParty(prev => ({ ...prev, members: updatedMembers }));
        setDraggedMember(null);
    };

    // 빈 슬롯 클릭 (멤버 추가)
    const handleEmptySlotClick = (partyIndex: number, slotIndex: number) => {
        if (!isEditMode) return;
        setSelectedSlot({ partyIndex, slotIndex });
        onOpen();
    };

    // 멤버 제거
    const handleRemoveMember = (memberId: string) => {
        if (!isEditMode) return;
        setParty(prev => ({
            ...prev,
            members: prev.members.filter(m => m.id !== memberId)
        }));
    };

    // 버튼 핸들러들
    const handleSave = () => {
        console.log('파티 저장', party);
        // 저장 로직
    };

    const handleCancel = () => {
        console.log('파티 수정 취소');
        // 취소 로직 (이전 상태로 복원 또는 페이지 이동)
    };

    const handleDelete = () => {
        console.log('파티 삭제');
        // 삭제 로직
    };

    // 파티별로 그룹화된 테이블 행 생성
    const generateTableRows = () => {
        const rows: JSX.Element[] = [];
        const membersPerParty = 4;
        const totalParties = Math.ceil(maxMembers / membersPerParty);

        for (let partyIndex = 0; partyIndex < totalParties; partyIndex++) {
            const partyColor = colorUtils.getPartyColorByIndex(partyIndex);
            const membersInThisParty = party.members.filter(m => m.partyColor === partyColor);

            for (let slotIndex = 0; slotIndex < membersPerParty; slotIndex++) {
                const memberInSlot = membersInThisParty[slotIndex];
                const globalIndex = partyIndex * membersPerParty + slotIndex;

                if (globalIndex < maxMembers) {
                    if (memberInSlot) {
                        // 실제 파티원이 있는 경우
                        rows.push(
                            <Table.Row
                                key={`party-${partyIndex}-slot-${slotIndex}`}
                                draggable={isEditMode}
                                onDragStart={() => handleDragStart(memberInSlot, party.members.indexOf(memberInSlot))}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(partyIndex, slotIndex)}
                                style={{ cursor: isEditMode ? 'move' : 'default' }}
                            >
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
                                <Table.Cell>
                                    <HStack justify="space-between">
                                        <Text>{memberInSlot.characterName}</Text>
                                        {isEditMode && (
                                            <Button
                                                size="xs"
                                                variant="ghost"
                                                colorScheme="red"
                                                onClick={() => handleRemoveMember(memberInSlot.id)}
                                            >
                                                {LuX({size: 12})}
                                            </Button>
                                        )}
                                    </HStack>
                                </Table.Cell>
                                <Table.Cell>{memberInSlot.fame.toLocaleString()}</Table.Cell>
                                <Table.Cell>{memberInSlot.itemSet} ({memberInSlot.itemGrade})</Table.Cell>
                            </Table.Row>
                        );
                    } else {
                        // 빈 슬롯인 경우
                        rows.push(
                            <Table.Row
                                key={`party-${partyIndex}-empty-${slotIndex}`}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(partyIndex, slotIndex)}
                            >
                                <Table.Cell>
                                    <Badge colorScheme={partyColor} variant="outline">
                                        {colorUtils.getPartyColorName(partyColor)}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <Box
                                        bg={emptySlotBg}
                                        p={2}
                                        borderRadius="md"
                                        cursor={isEditMode ? 'pointer' : 'default'}
                                        onClick={() => handleEmptySlotClick(partyIndex, slotIndex)}
                                        _hover={isEditMode ? { bg: emptySlotHoverBg } : {}}
                                    >
                                        <Center>
                                            <HStack gap={2} color="gray.500">
                                                {LuUser({size:16})}
                                                <Text fontSize="sm">
                                                    {isEditMode ? '클릭하여 추가' : '빈 자리'}
                                                </Text>
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
        <>
            <Box bg={bgColor} minH="100vh" py={THEME.spacing.page} padding={0}>
                <Container maxW="container.xl" padding={0}>
                    <VStack gap={THEME.spacing.section} align="stretch">
                        <Box bg={cardBg} p={THEME.spacing.section} borderRadius={THEME.radii.card} shadow={THEME.shadows.card}>
                            <HStack justify="space-between" align="center" mb={4}>
                                <HStack gap={3} align="center">
                                    <Badge colorScheme={colorUtils.getPartyTypeColor(party.type)} fontSize="md" px={3} py={1}>
                                        {colorUtils.getPartyTypeLabel(party.type)}
                                    </Badge>

                                    {/* 공대명 입력 필드 */}
                                    {isEditMode ? (
                                        <Input
                                            value={party.title}
                                            onChange={handleTitleChange}
                                            size="lg"
                                            fontSize="xl"
                                            fontWeight="bold"
                                            variant="flushed"
                                            placeholder="공대명을 입력하세요"
                                            maxW="400px"
                                        />
                                    ) : (
                                        <Heading size="lg">{party.title}</Heading>
                                    )}

                                    {isEditMode && (
                                        <Badge colorScheme="orange" variant="outline">
                                            수정 모드
                                        </Badge>
                                    )}
                                </HStack>

                                {/* 수정 모드에서만 삭제/취소/저장 버튼 표시 */}
                                {isMyPage && isEditMode && (
                                    <HStack gap={2}>
                                        <Button
                                            variant="outline"
                                            colorScheme="red"
                                            size="sm"
                                            onClick={handleDelete}
                                        >
                                            <HStack gap={2}>
                                                {LuTrash2({size: 16})}
                                                <Text>삭제</Text>
                                            </HStack>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            colorScheme="gray"
                                            size="sm"
                                            onClick={handleCancel}
                                        >
                                            <HStack gap={2}>
                                                {LuX({size: 16})}
                                                <Text>취소</Text>
                                            </HStack>
                                        </Button>
                                        <Button
                                            colorScheme="blue"
                                            size="sm"
                                            onClick={handleSave}
                                        >
                                            <HStack gap={2}>
                                                {LuSave({size:16})}
                                                <Text>저장</Text>
                                            </HStack>
                                        </Button>
                                    </HStack>
                                )}
                            </HStack>

                            {/* 컨텐츠/난이도 선택 및 옵션 */}
                            {isEditMode && (
                                <VStack gap={4} mb={6}>
                                    <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} w="full">
                                        {/* 컨텐츠 선택 */}
                                        <GridItem>
                                            <VStack align="stretch" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium">컨텐츠</Text>
                                                <Select.Root
                                                    value={[party.content]}
                                                    onValueChange={handleContentChange}
                                                    positioning={{ placement: "bottom-start" }}
                                                >
                                                    <Select.HiddenSelect />
                                                    <Select.Control>
                                                        <Select.Trigger>
                                                            <Select.ValueText placeholder="컨텐츠 선택" />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <Select.Indicator />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {contentOptions.map((option) => (
                                                                <Select.Item key={option.value} item={option.value}>
                                                                    <Select.ItemText>{option.label}</Select.ItemText>
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Select.Root>
                                            </VStack>
                                        </GridItem>

                                        {/* 난이도 선택 */}
                                        <GridItem>
                                            <VStack align="stretch" gap={2}>
                                                <Text fontSize="sm" fontWeight="medium">난이도</Text>
                                                <Select.Root
                                                    value={[party.difficulty]}
                                                    onValueChange={handleDifficultyChange}
                                                    positioning={{ placement: "bottom-start" }}
                                                >
                                                    <Select.HiddenSelect />
                                                    <Select.Control>
                                                        <Select.Trigger>
                                                            <Select.ValueText placeholder="난이도 선택" />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <Select.Indicator />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {difficultyOptions.map((option) => (
                                                                <Select.Item key={option.value} item={option.value}>
                                                                    <Select.ItemText>{option.label}</Select.ItemText>
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Select.Root>
                                            </VStack>
                                        </GridItem>
                                    </Grid>

                                    {/* 옵션 체크박스 */}
                                    <HStack gap={6} w="full" justify="flex-start">
                                        <Checkbox.Root
                                            checked={party.isSearchable}
                                            onCheckedChange={(details: { checked: boolean }) => handleSearchableChange(details.checked)}
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>검색 가능</Checkbox.Label>
                                        </Checkbox.Root>

                                        <Checkbox.Root
                                            checked={party.isPrivate}
                                            onCheckedChange={(details: { checked: boolean }) => handlePrivateChange(details.checked)}
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>비공개</Checkbox.Label>
                                        </Checkbox.Root>
                                    </HStack>
                                </VStack>
                            )}

                            {isEditMode && (
                                <Box mb={4} p={3} bg={editmodeBg1} borderRadius="md">
                                    <Text fontSize="sm" color={editmodeBg2}>
                                        💡 파티원을 드래그하여 다른 파티로 이동하거나, 빈 자리를 클릭하여 새 파티원을 추가할 수 있습니다.
                                    </Text>
                                </Box>
                            )}

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

            {/* 파티원 추가 모달 */}
            <Portal>
                <DialogRoot 
                    open={open} 
                    onOpenChange={(details: { open: boolean }) => !details.open && onClose()} 
                    size={"lg"}
                >
                    <DialogBackdrop />
                    <DialogContent 
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 9999,
                            backgroundColor: 'white',
                            border: '2px solid red', // 테스트용 - 나중에 제거
                            padding: '20px',
                            borderRadius: '8px',
                            minWidth: '400px',
                            minHeight: '300px'
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle style={{ color: 'black', fontSize: '18px', fontWeight: 'bold' }}>
                                파티원 추가
                            </DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <VStack gap={4} align="stretch">
                                <Text style={{ color: 'black' }}>파티원 검색 컴포넌트가 여기에 들어갑니다.</Text>
                                <Text fontSize="sm" color="gray.500" style={{ color: 'gray' }}>
                                    선택된 슬롯: {selectedSlot && `${colorUtils.getPartyColorName(colorUtils.getPartyColorByIndex(selectedSlot.partyIndex))} 파티 ${selectedSlot.slotIndex + 1}번 자리`}
                                </Text>
                                
                                {/* 임시 테스트 콘텐츠 */}
                                <CharacterSearch />
                            </VStack>
                        </DialogBody>
                        <DialogFooter>
                            <DialogCloseTrigger asChild>
                                <Button variant="outline">취소</Button>
                            </DialogCloseTrigger>
                            <Button colorScheme="blue">추가</Button>
                        </DialogFooter>
                        <DialogCloseTrigger />
                    </DialogContent>
                </DialogRoot>
            </Portal>
        </>
    );
};

export default MyPartyEditor;