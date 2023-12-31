import "./ChatPageStyle.css";
import { Box } from '@chakra-ui/react';
import "./ChatPageStyle.css";
import { useChatContext } from '../../Context/chatProvider';
import SideDrawer from '../../components/miscellaneous/SideDrawer/HeaderSideDrawer';
import MyChats from '../../components/MyChats/MyChats';
import ChatBox from '../../components/ChatBox/ChatBox';
import { useState } from "react";


const ChatPage = () => {

    const { user } = useChatContext();
    const [fetchAgain, setFetchAgain] = useState(); // this is for fetching chat again-and-again with updated chat..
    // console.log(user);

    return (
        <div className='chatPage'>
            {user && <SideDrawer />}
            <Box
                className='chat-section'
            >
                {user && (
                    <MyChats fetchAgain={fetchAgain} />
                )}
                {user && (
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </Box>
        </div>
    )
}

export default ChatPage