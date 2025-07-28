import React, { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Button,
  Text,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  HStack,
  Avatar,
} from '@chakra-ui/react';
import { FaBug, FaUser, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useColorModeValue } from './ui/color-mode';
import { ColorModeButton } from './ui/color-mode';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // 테스트용 로그인 함수
  const handleLogin = () => {
    setUser({
      id: '1',
      name: '던파유저',
      email: 'user@example.com',
      avatar: undefined
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleBugReport = () => {
    // 버그 신고 로직
    console.log('버그 신고 페이지로 이동');
  };

  const handleGoMypage = () => {
    window.location.href = '/mypage';
  }

  return (
    <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} py={4}>
      <Container maxW="6xl">
        <Stack direction="row" justify="space-between" align="center">
          {/* 로고 영역 */}
          <Text fontSize="xl" fontWeight="bold" color="blue.500" onClick={() => window.location.href = '/'}>
            던파티
          </Text>

          {/* 우측 버튼 영역 */}
          <HStack gap={4}>
            {/* 버그/건의사항 버튼 */}
            <Button
              variant="ghost"
              colorScheme="gray"
              size="sm"
              onClick={handleBugReport}
            >
              <HStack gap={2}>
                <Box>{FaBug({})}</Box>
                <Text>버그 신고</Text>
              </HStack>
            </Button>

            {/* 다크모드 토글 */}
            <ColorModeButton />

            {/* 로그인/사용자 메뉴 */}
            {isLoggedIn && user ? (
              <MenuRoot>
                <MenuTrigger asChild>
                  <Button variant="ghost" size="sm" p={1}>
                    <HStack gap={2}>
                      <Avatar.Root size="sm">
                        <Avatar.Image src={user.avatar} />
                        <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                      </Avatar.Root>
                      <Text fontSize="sm">{user.name}</Text>
                    </HStack>
                  </Button>
                </MenuTrigger>
                <MenuContent
                  bg={bgColor}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  boxShadow="lg"
                  minW="180px"
                  p={1}
                  zIndex={1000}
                  position="absolute"
                  top="100%"
                  right="0"
                  mt={1}
                >
                  <MenuItem>
                    <HStack
                        gap={2}
                        onClick={handleGoMypage}>
                      <Box>{FaUser({})}</Box>
                      <Text>내 프로필</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem>
                    <HStack gap={2}>
                      <Box>{FaCog({})}</Box>
                      <Text>설정</Text>
                    </HStack>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem onClick={handleLogout}>
                    <HStack gap={2}>
                      <Box>{FaSignOutAlt({})}</Box>
                      <Text>로그아웃</Text>
                    </HStack>
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            ) : (
              <HStack gap={2}>
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  size="sm"
                  onClick={handleLogin}
                >
                  <HStack gap={2}>
                    <Box>{FaSignInAlt({})}</Box>
                    <Text>로그인</Text>
                  </HStack>
                </Button>
                <Button
                  colorScheme="blue"
                  size="sm"
                >
                  <HStack gap={2}>
                    <Box>{FaUserPlus({})}</Box>
                    <Text>회원가입</Text>
                  </HStack>
                </Button>
              </HStack>
            )}
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Header;