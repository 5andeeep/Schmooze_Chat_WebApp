import "./GroupChatModalStyle.css";
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useChatContext } from '../../../Context/chatProvider';
import UserListItem from "../../UserList/UserListItem";
import axios from "axios";
import UserBadgeItem from "../../UserList/UserBadgeItem";

// This is a pop window when we click on the "New Group Chat +" button that is called Modal

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setselectedUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, chats, setChats } = useChatContext(); // from chat context
    // console.log(user);
    const toast = useToast(); // from chakra UI..

    // function to add searched users in the group...
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
            // here also we are using (search user API) as we used it side-bar search
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

    // function to create chat group button...
    // Here we are going to add the user in the mongoDB 
    // we are going to use GroupChat API to add group in DB..
    const handleSubmit = async () => {
        // if any of the detail is empty give warning to fill all details
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please provide all the details!",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        // fetching api
        try {
            // headers for api
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            // fetching 3rd API from chatRoutes to created chatgroup...
            const { data } = await axios.post("/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config);

            // we are adding this data before existing chats because we want..
            // this recent data to the very top...
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom"
            });

        } catch (error) {
            console.log(error);
            toast({
                title: "Failed to create group chat!",
                description: error.message,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }

    // function to add user in the group...
    const handleAddInGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already Added",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        setselectedUsers([...selectedUsers, userToAdd]);
    };

    // function to remove user if added in the group..
    const handleDelete = (removeUser) => {
        setselectedUsers(selectedUsers.filter((sel) => sel._id !== removeUser._id));
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className='modal-heading'>Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className="modal-body">
                        <FormControl>
                            <Input className="group-name-input" placeholder="Group Name" onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input className="group-users-name-input" placeholder="Add Users" onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {/* selected users list here */}
                        <Box className="selected-users-box">
                            {selectedUsers.map(addedUser => (
                                <UserBadgeItem
                                    key={addedUser._id}
                                    user={addedUser}
                                    handleFunction={() => handleDelete(addedUser)}
                                />
                            ))}
                        </Box>
                        {/* render searched user here... */}
                        {loading ? <div>Loading...</div> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddInGroup(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal