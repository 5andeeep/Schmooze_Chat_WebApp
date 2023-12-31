import "./ScrollableChatStyle.css";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
} from "../../Config/ChatLogics";
import { useChatContext } from "../../Context/chatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
    const { user } = useChatContext();

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div className="message-box" key={i}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        // mt={"7px"}
                                        mr={1}
                                        size={"sm"}
                                        cursor={"pointer"}
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )}
                        <span
                            className={m.sender._id === user._id ? "user-one" : "user-two"}
                            style={{
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
