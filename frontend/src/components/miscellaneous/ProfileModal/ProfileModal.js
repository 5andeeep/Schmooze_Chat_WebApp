import "./ProfileModalStyle.css";
import React from 'react';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

// profileModal is to show profile of the user..
const ProfileModal = ({ user, children }) => {
    // this is used when we use Modal from chakra UI and we have to use useDisclosure hook
    const { isOpen, onOpen, onClose } = useDisclosure();


    return (
        <div>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
                )
            }
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"} fontSize={"3xl"}>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className="modalBody">
                        <Image boxSize={"150px"} src={user.pic} alt={user.name} borderRadius={"full"} />
                        <Text fontSize={{ base: "20px", md: "24px" }}>
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileModal