import "./MyChatsStyle.css";
import React, { useEffect, useState } from 'react'
import { useChatContext } from "../../Context/chatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../miscellaneous/ChatLoading/ChatLoading";
import { getSender } from "../../Config/ChatLogics";
import GroupChatModal from "../miscellaneous/GroupChatModal/GroupChatModal";

const MyChats = ({ fetchAgain }) => {

    const [currentUser, setCurrentUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = useChatContext();
    const toast = useToast();

    // Here we are going to display chat of users so...
    // we will fetch chats here and using /api/chat.get api
    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get("/api/chat", config);
            // console.log(data);
            setChats(data);
        }
        catch (err) {
            toast({
                title: "Failed to fetch the Chats",
                description: err.messge,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    };


    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain])


    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDirection={"column"}
            alignItems={"center"}
            w={{ base: "100%", md: "31%" }}
            className="myChat-wrapper"
        >
            <Box className="myChat-title" fontSize={{ base: "20px", md: "24px" }}>
                My Chats
                <GroupChatModal>
                    <Button
                        display={"flex"}
                        fontSize={{ base: "16px", md: "10px", lg: "16px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box className="chats">
                {chats ? (
                    <Stack overflowY={"scroll"}>
                        {chats.map((chat) => (
                            <Box
                                className="people-to-chat"
                                onClick={() => setSelectedChat(chat)}
                                bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                                color={selectedChat === chat ? "white" : "black"}
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat ? getSender(currentUser, chat.users) : chat.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default MyChats