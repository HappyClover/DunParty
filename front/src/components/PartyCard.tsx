import React from 'react';
import {
  Box,
  Stack,
  Heading,
  Text,
  Button,
  GridItem,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

export interface PartyData {
  id: string;
  title: string;
  dungeon: string;
  currentMembers: number;
  maxMembers: number;
  schedule: string;
  difficulty?: 'easy' | 'normal' | 'hard' | 'expert';
  status?: 'recruiting' | 'full' | 'closed';
  description?: string;
  requirements?: string[];
}

interface PartyCardProps {
  party: PartyData;
  onJoin?: (partyId: string) => void;
  onView?: (partyId: string) => void;
  showJoinButton?: boolean;
  showViewButton?: boolean;
}

const PartyCard: React.FC<PartyCardProps> = ({
  party,
  onJoin,
  onView,
  showJoinButton = true,
  showViewButton = false,
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'normal': return 'blue';
      case 'hard': return 'orange';
      case 'expert': return 'red';
      default: return 'gray';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'recruiting': return 'green';
      case 'full': return 'orange';
      case 'closed': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'recruiting': return '모집중';
      case 'full': return '모집완료';
      case 'closed': return '마감';
      default: return '상태 확인 중';
    }
  };

  const isJoinable = party.status === 'recruiting' && party.currentMembers < party.maxMembers;

  return (
    <GridItem>
      <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" h="full">
        <Stack gap={4} h="full">
          {/* 헤더 영역 */}
          <Stack gap={2}>
            <HStack justify="space-between" align="flex-start">
              <Heading 
                size="lg" 
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                flex="1"
              >
                {party.title}
              </Heading>
              {party.status && (
                <Badge colorScheme={getStatusColor(party.status)} variant="subtle">
                  {getStatusText(party.status)}
                </Badge>
              )}
            </HStack>

            {/* 난이도 배지 */}
            {party.difficulty && (
              <HStack>
                <Badge colorScheme={getDifficultyColor(party.difficulty)} variant="outline">
                  {party.difficulty.toUpperCase()}
                </Badge>
              </HStack>
            )}
          </Stack>

          {/* 정보 영역 */}
          <Stack gap={2} align="flex-start" flex="1">
            <Text color={textColor}>
              <Text as="span" fontWeight="semibold">던전:</Text> {party.dungeon}
            </Text>
            <Text color={textColor}>
              <Text as="span" fontWeight="semibold">모집 인원:</Text> {party.currentMembers}/{party.maxMembers}명
            </Text>
            <Text color={textColor}>
              <Text as="span" fontWeight="semibold">시간:</Text> {party.schedule}
            </Text>
            
            {/* 설명 */}
            {party.description && (
              <Text 
                color={textColor} 
                fontSize="sm" 
                overflow="hidden"
                textOverflow="ellipsis"
                display="-webkit-box"
                css={{
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {party.description}
              </Text>
            )}

            {/* 요구사항 */}
            {party.requirements && party.requirements.length > 0 && (
              <Stack gap={1}>
                <Text fontSize="sm" fontWeight="semibold">요구사항:</Text>
                <HStack wrap="wrap" gap={1}>
                  {party.requirements.map((req, index) => (
                    <Badge key={index} variant="outline" fontSize="xs">
                      {req}
                    </Badge>
                  ))}
                </HStack>
              </Stack>
            )}
          </Stack>

          {/* 버튼 영역 */}
          <HStack gap={2} mt="auto">
            {showJoinButton && (
              <Button
                colorScheme="blue"
                size="sm"
                flex="1"
                onClick={() => onJoin?.(party.id)}
                disabled={!isJoinable}
              >
                {isJoinable ? '참여하기' : '참여 불가'}
              </Button>
            )}
            {showViewButton && (
              <Button
                variant="outline"
                colorScheme="blue"
                size="sm"
                flex="1"
                onClick={() => onView?.(party.id)}
              >
                자세히 보기
              </Button>
            )}
          </HStack>
        </Stack>
      </Box>
    </GridItem>
  );
};

export default PartyCard;