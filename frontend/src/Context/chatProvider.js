import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [user, setUser] = useState(); // user is coming from localStorage...
    const [selectedChat, setSelectedChat] = useState(); // used in MyChats.js
    const [chats, setChats] = useState([]); // chats are added in MyChats.js
    const [notification, setNotification] = useState([]); // used in SingleChat.js 
    const navigate = useNavigate();
    // we are setting up user (localStorage.setItem()) in login and signup
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        setUser(userInfo);
        // if user not login then it should redirect to the login page...
        if (!userInfo) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [navigate]);


    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext);