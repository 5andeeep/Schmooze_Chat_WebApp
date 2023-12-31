import "./UGCMStyle.css";
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useState } from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import { useChatContext } from "../../../Context/chatProvider";
import UserBadgeItem from "../../UserList/UserBadgeItem";
import axios from "axios";
import UserListItem from "../../UserList/UserListItem";


// This pop-up box is only for group chat information and update group
// and for single person we have created different pop-up window (profileModal)

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, setSelectedChat, selectedChat } = useChatContext();
    const [groupChatName, setGroupChatName] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    // function to add searched user in the chat group
    const handleAddUser = async (userToAdd) => {
        // if user already there in the group give an error..
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: "User already in the group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        // check only groupAdmin can add users not every...
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add users!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put("/api/chat/addtogroup", {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, config);

            // sending updated chatgroup data..
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title: "Failed to add User in the Group!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

    // Function to remove a user from a group OR remove yourself from a group
    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: "Only Admin can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        try {
            // fetching removeUser API
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put("/api/chat/removefromgroup", {
                chatId: selectedChat._id,
                userId: userToRemove._id
            }, config);

            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            // so after removing someone messages should also update..
            fetchMessages(); // SingleChat.js
            setLoading(false);
        } catch (error) {
            toast({
                title: "Failed to remove from the Group!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

    // function to rename the group chat name
    // We are going to fetch group rename API here....
    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        // fetching api
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put("/api/chat/renamegroup", {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            // updated data send
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Failed to rename Group Name!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setRenameLoading(false);
        }

        setGroupChatName("");
    }

    // function to search user name to add in the group
    const handleSearch = async (query) => {
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            // headers for api
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            // here also we are using (search user API) such as we used it side-bar search
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: "Error while creating group!",
                description: error.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }



    return (
        <>
            <IconButton icon={<ViewIcon />} display={{ base: "flex" }} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className="modal-header" fontSize={"26px"} textAlign={"center"}>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box className="users-box">
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display={"flex"}>
                            <Input
                                placeholder="Group Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button variant={"solid"} colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users"
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (<Spinner size={"1g"} />) : (
                            searchResult?.map((usr) => (
                                <UserListItem
                                    key={usr._id}
                                    user={usr}
                                    handleFunction={() => handleAddUser(usr)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        {/* This button is for logged in user who wants to leave the group */}
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal;