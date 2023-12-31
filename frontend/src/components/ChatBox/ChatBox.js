import "./ChatBoxStyle.css";
import React from 'react';
import { useChatContext } from "../../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "../SingleChat/SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

    const { selectedChat } = useChatContext();

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems={"center"}
            flexDirection={"column"}
            w={{ base: "100%", md: "68%" }}
            className="chat-wrapper"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatBox