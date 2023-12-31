import "./UserListItemStyle.css";
import React from 'react';
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItem = ({ user, handleFunction, key }) => {

    return (
        <Box className='userList-box' onClick={handleFunction} key={key}>
            <Avatar size={"sm"} name={user.name} src={user.pic} mr={"7px"} />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize={"xs"}><b>Email : </b>{user.email}</Text>
            </Box>
        </Box>
    )
}

export default UserListItem