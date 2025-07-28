import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import MyPage from "./pages/Mypage";
import PartySearch from "./pages/PartySearch";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/party",
        element: <PartySearch />,
    },
    {
        path: "/mypage",
        element: <MyPage pageType={"dashboard"}/>,
    },
    {
        path: "/mypage/party",
        element: <MyPage pageType={"myparty"}/>,
    },
    {
        path: "/mypage/party/:partyId",
        element: <MyPage pageType={"partyDetail"} />,
    },
    {
        path: "/mypage/party/editor",
        element: <MyPage pageType={"partyEditor"} />,
    },
    {
        path: "/mypage/adventure",
        element: <MyPage pageType={"adventures"}/>,
    },
    {
        path: "/mypage/adventure/:adventureId",
        element: <MyPage pageType={"adventureDetail"}/>,
    },
    {
        path: "/mypage/bookmark",
        element: <MyPage pageType={"bookmarks"}/>,
    },
]);

const Routes = () => {
    return <RouterProvider router={router} />;
};

export default Routes;