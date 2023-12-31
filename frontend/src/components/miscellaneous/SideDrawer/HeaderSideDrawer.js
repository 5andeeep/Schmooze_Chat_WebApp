import "./SideDrawerStyle.css";
import { Box, Button, Menu, MenuButton, MenuList, Text, Avatar, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../../../Context/chatProvider";
import ProfileModal from "../ProfileModal/ProfileModal";
import axios from "axios";
import ChatLoading from "../ChatLoading/ChatLoading";
import UserListItem from "../../UserList/UserListItem";
import { getSender } from "../../../Config/ChatLogics";
import { Effect } from "react-notification-badge"; // for notification count
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

const HeaderSideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = useChatContext();
    // console.log(user);
    // console.log(search);
    // console.log(searchResult);

    // useDisclosure hook from chakra UI to fetch these element for side bar..
    const { isOpen, onOpen, onClose } = useDisclosure()

    // function to search user to chat using side bar search
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter name or email to find user!",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            // console.log(data);
            setLoading(false);
            setSearchResult(data);
        }
        catch (err) {
            console.log(err.message);
            toast({
                title: "Failed to Load the Search Results!",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }

    // accessing the exists chat, if not existing then creating new chat
    // using /api/chat/.post api..
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post("/api/chat", { userId }, config);

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        }
        catch (err) {
            console.log(err);
            toast({
                title: "Error occured while accessing/creating chat!",
                description: err.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    // Function to logout the user...
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    }

    return (
        <>
            <Box className='sidebar'>
                <Button variant={"ghost"} onClick={onOpen} title="Search Users to Chat" className="search-user-btn">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <Text display={{ base: "none", md: "flex" }} px={"4"}>
                        Search User
                    </Text>
                </Button>
                {/* <Tooltip label="Search Users to Chat" hasArrow placeContent={"bottom"}>
                </Tooltip> */}
                <Text fontSize={"2xl"}>
                    Schmooze App
                </Text>
                <div>
                    <Menu>
                        {/* we can write button this way and in different way as well see the cheveron button */}
                        <MenuButton p={'1em'}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize={"2xl"} m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size={"sm"} cursor={"pointer"} name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider></MenuDivider>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            {/* side-bar */}
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay /> {/* this is a shadow when we open side bar*/}
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
                    <DrawerBody className="side-bar-body">
                        <Box className="side-bar-box">
                            <Input id="sideBar-search-input" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch}>Find</Button>
                        </Box>
                        {loading ? <ChatLoading /> : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user.id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default HeaderSideDrawer;