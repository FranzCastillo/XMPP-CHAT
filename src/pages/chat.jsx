import React, {useState, useEffect} from 'react';
import Sidebar from "../components/sidebar";
import ChatDisplay from "../components/chatDisplay";
import client from "../utils/xmpp/client";

const Chat = (props) => {
    const [displayedChat, setDisplayedChat] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (displayedChat) {
            client.setMessageCallback((jid, message) => {
                if (jid === displayedChat) {
                    setMessages(prevMessages => [...prevMessages, message]);
                }
            });
        }
    }, [displayedChat]);

    return (
        <div className={"flex flex-row h-screen"}>
            <Sidebar setDisplayedChat={setDisplayedChat}/>
            <div className={"flex-grow"}>
                {displayedChat ? (
                    <ChatDisplay jid={displayedChat} messages={messages}/>
                ) : (
                    <div className={"flex flex-col items-center justify-center h-full"}>
                        <span className={"text-white"}>Select a chat to start messaging</span>
                    </div>
                )
                }
            </div>
        </div>
    )
};

export default Chat;
