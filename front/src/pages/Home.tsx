import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FaUsers, FaCalendarAlt, FaGamepad } from 'react-icons/fa';
import { useColorModeValue } from '../components/ui/color-mode';
import Header from '../components/Header';
import PartyCard, { PartyData } from '../components/PartyCard';
import PartySearch from "../components/PartySearch";

const Home: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // 샘플 파티 데이터
  const sampleParties: PartyData[] = [
    {
      id: '1',
      title: '이스핀즈 파티 모집',
      dungeon: '이스핀즈',
      currentMembers: 2,
      maxMembers: 4,
      schedule: '오늘 오후 8시',
      difficulty: 'normal',
      status: 'recruiting',
      description: '편안하게 진행할 예정입니다. 초보자도 환영!',
      requirements: ['레벨 110+', '기본 장비']
    },
    {
      id: '2',
      title: '바칼 레이드 파티',
      dungeon: '바칼 레이드',
      currentMembers: 6,
      maxMembers: 8,
      schedule: '내일 오후 7시',
      difficulty: 'expert',
      status: 'recruiting',
      description: '숙련자 위주로 빠른 클리어 목표입니다.',
      requirements: ['레벨 120+', '전문 장비', '경험 필수']
    },
    {
      id: '3',
      title: '던파 신규 유저 가이드',
      dungeon: '천계',
      currentMembers: 4,
      maxMembers: 4,
      schedule: '오늘 오후 6시',
      difficulty: 'easy',
      status: 'full',
      description: '신규 유저를 위한 가이드 파티입니다.',
      requirements: ['레벨 100+']
    }
  ];

  const handleJoinParty = (partyId: string) => {
    console.log('파티 참여:', partyId);
    // 파티 참여 로직 구현
  };

  const handleViewParty = (partyId: string) => {
    console.log('파티 상세보기:', partyId);
    // 파티 상세보기 로직 구현
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* 헤더 */}
      <Header />

      {/* 메인 히어로 섹션 */}
      <Box bg="blue.600" color="white" py={20}>
        <Container maxW="6xl">
          <Stack gap={6} textAlign="center" align="center">
            <Heading size="4xl">던파티</Heading>
            <Text fontSize="xl" maxW="800px">
              던파티는 파티 및 공대를 구성하고 파티의 예상 화력을 확인하는 서비스입니다.
            </Text>
            <Stack direction="row" gap={4}>
              <Button colorScheme="white" variant="outline" size="lg">
                파티 찾기
              </Button>
              <Button colorScheme="orange" size="lg">
                파티 만들기
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* 메인 콘텐츠 */}
      <Container maxW="6xl" py={16}>
        <Stack gap={16}>
          {/* 기능 소개 */}
          <Stack gap={8} textAlign="center" align="center">
            <PartySearch />
          </Stack>

          {/* 최근 파티 */}
          <Stack gap={8} w="full">
            <Heading size="2xl" textAlign="center">최근 확인 파티</Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6} w="full">
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
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;