// this logic is to show the name of users whome you are chatting with...
export const getSender = (currentUser, users) => {
    return users[0]?._id === currentUser?._id ? users[1].name : users[0].name;
}

/* --------------------------------------------------------------------------------- */

// this logic is to show profile pic and email id of the user
export const getSenderFull = (currentUser, users) => {
    return users[0]?._id === currentUser?._id ? users[1] : users[0];
}

/* --------------------------------------------------------------------------------- */

// this logic is to show the other user profile pic in the chat box but when it is the last message send by him/her in a bunch of messages.
// in simple way if other send send some number of messages then we don't have to show his/her profile pic in every message, we will show profile pic on the last message.
// 1. first we check if message sender is same or not..(this should be second user)
export const isSameSender = (messages, currMessage, currMessageIndex, userId) => {
    return (
        currMessageIndex < messages.length - 1 &&
        (messages[currMessageIndex + 1].sender._id !== currMessage.sender._id || messages[currMessageIndex + 1].sender._id === undefined) && messages[currMessageIndex].sender._id !== userId
    );
};
// 2. second we check if message is last or not..(message should be last message)
// here we will display photo if conditions match..
export const isLastMessage = (messages, currMessageIndex, userId) => {
    return (
        currMessageIndex === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};


// this logic is only for right side margin...
// m = current message, i = current message index, userId = current logged in userId
export const isSameSenderMargin = (messages, m, i, userId) => {
    if (i < messages.length - 1 &&
        (messages[i + 1].sender._id === m.sender._id && messages[i].sender._id !== userId)) {
        return 35;
    }
    else if ((i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id && messages[i].sender._id !== userId) || (i === messages.length - 1 && messages[i].sender._id !== userId)) {
        return 0;
    }
    else {
        return "auto";
    }
};


// if the message is from opposite side those message should be on the left side...
// and vise-versa..
export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
}

