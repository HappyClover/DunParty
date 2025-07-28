import React, { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Input,
  HStack,
  VStack,
} from '@chakra-ui/react';
import {FaSearch, FaUserPlus} from 'react-icons/fa';
import { useColorModeValue } from './ui/color-mode';
import { useNavigate } from 'react-router-dom';

// 던전/레이드 목록
const dungeonList = [
  '시로코 레이드',
  '바칼 레이드',
  '이스핀즈',
  '백화점',
  '거북이 섬',
  '안톤 레이드',
  '루크 레이드',
  '천계',
  '흑룡 레이드'
];

const PartySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDungeon, setSelectedDungeon] = useState('');
  const navigate = useNavigate();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleSearch = () => {
    // 검색 페이지로 이동 (나중에 구현)
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append('search', searchTerm);
    if (selectedDungeon) searchParams.append('dungeon', selectedDungeon);
    
    console.log('검색 실행:', { searchTerm, selectedDungeon });
    // navigate(`/search?${searchParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="4xl">
        <VStack gap={8}>
          {/* 헤더 */}
          <VStack gap={4} textAlign="center">
            <Heading size="2xl">파티 & 공격대 검색</Heading>
            <Text fontSize="lg" color="gray.600">
              원하는 던전과 조건에 맞는 파티를 찾아보세요
            </Text>
          </VStack>

          {/* 검색 박스 */}
          <Box bg={cardBg} p={8} borderRadius="xl" boxShadow="lg" w="full" maxW="600px">
            <VStack gap={6}>
              {/* 검색어 입력 */}
              <VStack gap={2} w="full">
                <Text fontSize="sm" fontWeight="semibold" alignSelf="flex-start">
                  검색어
                </Text>
                <Input
                  placeholder="파티명, 던전명으로 검색..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="lg"
                  w="full"
                />
              </VStack>

              {/* 던전 선택 */}
              <VStack gap={2} w="full">
                <Text fontSize="sm" fontWeight="semibold" alignSelf="flex-start">
                  던전/레이드 선택
                </Text>
                <Box w="full">
                  <select
                    value={selectedDungeon}
                    onChange={(e) => setSelectedDungeon(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: 'white',
                      fontSize: '16px',
                      color: '#2D3748'
                    }}
                  >
                    <option value="">전체 던전/레이드</option>
                    {dungeonList.map((dungeon) => (
                      <option key={dungeon} value={dungeon}>
                        {dungeon}
                      </option>
                    ))}
                  </select>
                </Box>
              </VStack>

              {/* 검색 버튼 */}
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleSearch}
                w="full"
                h="50px"
              >
                <HStack gap={2}>
                  {FaSearch({})}
                  <Text>파티 검색</Text>
                </HStack>
              </Button>
            </VStack>
          </Box>

          {/* 빠른 검색 버튼들 */}
          <VStack gap={4} w="full" maxW="600px">
            <Text fontSize="sm" fontWeight="semibold" color="gray.600">
              최근 검색
            </Text>
            <HStack gap={2} wrap="wrap" justify="center">
              {['시로코 레이드', '바칼 레이드', '이스핀즈', '백화점'].map((dungeon) => (
                <Button
                  key={dungeon}
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setSelectedDungeon(dungeon);
                    const searchParams = new URLSearchParams();
                    searchParams.append('dungeon', dungeon);
                    console.log('빠른 검색:', dungeon);
                    // navigate(`/search?${searchParams.toString()}`);
                  }}
                >
                  {dungeon}
                </Button>
              ))}
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default PartySearch;