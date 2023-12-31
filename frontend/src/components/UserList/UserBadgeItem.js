import { Box } from "@chakra-ui/react";
import "./UserListItemStyle.css";
import React from 'react'
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, key, handleFunction }) => {
    return (
        <Box className="userBadgeList-box" key={key}>
            {user.name}
            <CloseIcon ml={"7px"} onClick={handleFunction} />
        </Box>
    )
}

export default UserBadgeItem