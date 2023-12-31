import "./SingleChatStyle.css";
import { useChatContext } from "../../Context/chatProvider";
import React, { useEffect, useState } from 'react';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Lottie from "react-lottie"; // for typing indicator
import animationData from "../../Animations/typing.json"; // for typing animation
import { getSender, getSenderFull } from "../../Config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "../ScrollableChat/ScrollableChat";
import io from "socket.io-client";


// setting up for client side socket.io
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false); // for socket
    const [typing, setTyping] = useState(false); // for typing indicator
    const [isTyping, setIsTyping] = useState(false); // for typing indicator
    const { user, selectedChat, setSelectedChat, notification, setNotification } = useChatContext();
    const toast = useToast();
    // console.log(messages);

    // using this object in <lottie /> for typing indicator
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidyMid meet",
        },
    };


    // function to fetch the all the messages...
    // calling API to fetch data..
    // fetch all messages of selected chat..
    const fetchMessages = async () => {
        if (!selectedChat) return; // if no chat selected..
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            // fetching message API
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            // creating socket for chat with help of selectedChat Id.
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the messages!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    };


    // function to send the message...
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id); // msg sent stop typing..
            try {
                const config = {
                    headers: {
                        // Using Content-type because we are sending data in json format
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                };
                // we want input empty before the message has been sent
                // it wont effect our api call because it is asynchronous
                setNewMessage("");
                // calling API of sending Message...
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);

                // console.log(data);
                // sending DATA to the "new message" socket for sending messages.
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error occured",
                    description: "Failed to send the message!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
            }
        }
    };

    // useEffect for socket.io(sockets)
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => {
            setSocketConnected(true);
        });
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        // eslint-disable-next-line
    }, []);

    //useEffect for fetching selectedChat messages
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    // console.log(notification, "-----");

    // useEffect for updating states contantly(hence no dependencies)..
    // we are receiving messages here from socket/sendMessage...
    useEffect(() => {
        // its gonna monitor we receive any message.
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give notification of receiving new message...
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });


    // Typing new message and logic of showing that typing indicator as well
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        // Typing Indicator Logic
        if (!socketConnected) return; // if socket not connected just do nothing..
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        startStopTypingIndicator();
    };

    // function for showing delay typing indicator..
    // we are kind handling throutling using this function..
    function startStopTypingIndicator() {
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        // after this much we will remove indicator..
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            // compare...
            if (timeDiff > timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text className="header-of-chat-area" fontSize={{ base: "20px", md: "24px" }} justifyContent={{ base: "space-between" }}>
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box className="msg-and-input-wraper">
                        {loading ? (
                            <Spinner
                                size={"xl"}
                                w={20}
                                h={20}
                                alignSelf={"center"}
                                margin={"auto"}
                            />
                        ) : (
                            <div className="messages-div">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? <div>
                                <Lottie
                                    width={50}
                                    style={{ marginBottom: "0px", marginLeft: "0px" }}
                                    options={defaultOptions}
                                />
                            </div> : <></>}
                            <Input
                                bg={"#e0e0e0"}
                                placeholder="Message"
                                value={newMessage}
                                onChange={typingHandler}
                                title=""
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box className="display-msg-box">
                    <Text className="display-msg-text">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat