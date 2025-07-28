import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    GridItem,
    VStack,
    Heading,
    Link,
    Image,
} from '@chakra-ui/react';
import {useColorModeValue} from '../components/ui/color-mode';
import Header from '../components/Header';
import Dashboard from './mypages/Dashboard';
import MyParty from './mypages/MyParty';
import Adventure from "./mypages/Adventure";
import PartyDetail from "./PartyDetail";
import MyPartyEditor from "./mypages/MyPartyEditor";
import AdventureDetail from "./mypages/AdventureDetail";
// import MyAdventures from './mypages/MyAdventures';
// import Settings from './mypages/Settings';
// import Bookmarks from './mypages/Bookmarks';

// 페이지 타입 정의
export type PageType = 'dashboard' | 'myparty' | 'adventures' | 'adventureDetail' | 'partyDetail' | 'partyEditor' | 'bookmarks';

interface MyPageProps {
    pageType: PageType;
}

const MyPage: React.FC<MyPageProps> = ({ pageType }) => {
    const location = useLocation();
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const sidebarBg = useColorModeValue('white', 'gray.800');

    // 현재 경로에 따른 활성화 상태 확인 (하위 경로 포함)
    const isActivePath = (path: string) => {
        const currentPath = location.pathname;

        // 정확히 일치하는 경우
        if (currentPath === path) {
            return true;
        }

        // 하위 경로인 경우 (단, 루트 경로 "/mypage"는 정확히 일치해야 함)
        if (path === '/mypage') {
            return currentPath === '/mypage';
        }

        // 다른 메뉴의 하위 경로인지 확인
        return currentPath.startsWith(path + '/');
    };

    // 페이지 타입에 따른 컴포넌트 렌더링
    const renderMainContent = () => {
        switch (pageType) {
            case 'dashboard':
                return <Dashboard />;
            case 'myparty':
                return <MyParty />;
            case 'adventures':
                return <Adventure />;
            case 'adventureDetail':
                return <AdventureDetail />;
            case 'partyDetail':
                return <PartyDetail />;
            case 'partyEditor':
                return <MyPartyEditor />
            // case 'bookmarks':
            //     return <Bookmarks />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <Box bg={bgColor}>
            <Header/>
            <Container maxW="8xl" py={8} h="fit-content">
                <Grid templateColumns="250px 1fr" gap={8} h="auto">
                    {/* Sidebar */}
                    <GridItem>
                        <Box
                            bg={sidebarBg}
                            p={4}
                            borderRadius="lg"
                            shadow="md"
                            h="calc(100vh - 100px)"
                            display="flex"
                            flexDirection="column"
                            position="sticky"
                            top="32px"
                        >
                            <VStack align="stretch" gap={4} flex="1">
                                <Heading size="md">마이 메뉴</Heading>
                                <Link
                                    href="/mypage"
                                    fontWeight={isActivePath('/mypage') ? 'bold' : 'normal'}
                                    color={isActivePath('/mypage') ? 'blue.500' : 'inherit'}
                                    bg={isActivePath('/mypage') ? 'blue.50' : 'transparent'}
                                    px={3}
                                    py={2}
                                    borderRadius="md"
                                    _hover={{
                                        color: 'blue.500',
                                        bg: 'blue.50',
                                        textDecoration: 'none'
                                    }}
                                    _dark={{
                                        bg: isActivePath('/mypage') ? 'blue.900' : 'transparent',
                                        _hover: { bg: 'blue.900' }
                                    }}
                                >
                                    대시보드
                                </Link>
                                <Link
                                    href="/mypage/party"
                                    fontWeight={isActivePath('/mypage/party') ? 'bold' : 'normal'}
                                    color={isActivePath('/mypage/party') ? 'blue.500' : 'inherit'}
                                    bg={isActivePath('/mypage/party') ? 'blue.50' : 'transparent'}
                                    px={3}
                                    py={2}
                                    borderRadius="md"
                                    _hover={{
                                        color: 'blue.500',
                                        bg: 'blue.50',
                                        textDecoration: 'none'
                                    }}
                                    _dark={{
                                        bg: isActivePath('/mypage/party') ? 'blue.900' : 'transparent',
                                        _hover: { bg: 'blue.900' }
                                    }}
                                >
                                    내 공격대
                                </Link>
                                <Link
                                    href="/mypage/adventure"
                                    fontWeight={isActivePath('/mypage/adventure') ? 'bold' : 'normal'}
                                    color={isActivePath('/mypage/adventure') ? 'blue.500' : 'inherit'}
                                    bg={isActivePath('/mypage/adventure') ? 'blue.50' : 'transparent'}
                                    px={3}
                                    py={2}
                                    borderRadius="md"
                                    _hover={{
                                        color: 'blue.500',
                                        bg: 'blue.50',
                                        textDecoration: 'none'
                                    }}
                                    _dark={{
                                        bg: isActivePath('/mypage/adventure') ? 'blue.900' : 'transparent',
                                        _hover: { bg: 'blue.900' }
                                    }}
                                >
                                    등록한 모험단
                                </Link>
                                <Link
                                    href="/mypage/bookmark"
                                    fontWeight={isActivePath('/mypage/bookmark') ? 'bold' : 'normal'}
                                    color={isActivePath('/mypage/bookmark') ? 'blue.500' : 'inherit'}
                                    bg={isActivePath('/mypage/bookmark') ? 'blue.50' : 'transparent'}
                                    px={3}
                                    py={2}
                                    borderRadius="md"
                                    _hover={{
                                        color: 'blue.500',
                                        bg: 'blue.50',
                                        textDecoration: 'none'
                                    }}
                                    _dark={{
                                        bg: isActivePath('/mypage/bookmark') ? 'blue.900' : 'transparent',
                                        _hover: { bg: 'blue.900' }
                                    }}
                                >
                                    즐겨찾기
                                </Link>
                            </VStack>

                            {/* 최하단 이미지 영역 */}
                            <Box mt="auto" pt={4} paddingX={5}>
                                <Image
                                    src="/images/neopleapi_color.png"
                                    alt="사이드바 이미지"
                                    w="full"
                                    h="auto"
                                    objectFit="contain"
                                    borderRadius="md"
                                />
                            </Box>
                        </Box>
                    </GridItem>

                    {/* Main Content */}
                    {renderMainContent()}

                </Grid>
            </Container>
        </Box>
    );
};

export default MyPage;