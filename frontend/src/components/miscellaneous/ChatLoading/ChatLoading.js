import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

// This component is only to show some shadows of search item...
// it is like loading component you must have seen this before in some websites..

const ChatLoading = () => {
    return (
        <Stack>
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
            <Skeleton height={"45px"} />
        </Stack>
    )
}

export default ChatLoading