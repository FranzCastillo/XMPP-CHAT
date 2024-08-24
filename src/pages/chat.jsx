import React, {useState, useEffect} from 'react';
import Sidebar from "../components/sidebar";
import ChatDisplay from "../components/chatDisplay";
import client from "../utils/xmpp/client";

const Chat = (props) => {
    const [displayedChat, setDisplayedChat] = useState(null);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        client.setMessageCallback((jid, message) => {
            setMessages(prevMessages => ({
                ...prevMessages,
                [jid]: [...(prevMessages[jid] || []), {text: message, sender: 'received'}]
            }));
        });
    }, []);

    const sendMessage = (message) => {
        client.sendMessage(displayedChat, message);
        setMessages(prevMessages => ({
            ...prevMessages,
            [displayedChat]: [...(prevMessages[displayedChat] || []), {text: message, sender: 'sent'}]
        }));
    };

    return (
        <div className={"flex flex-row h-screen"}>
            <Sidebar setDisplayedChat={setDisplayedChat}/>
            <div className={"flex-grow"}>
                {displayedChat ? (
                    <ChatDisplay
                        jid={displayedChat}
                        messages={messages[displayedChat] || []}
                        sendMessage={sendMessage}
                    />
                ) : (
                    <div className={"flex flex-col items-center justify-center h-full"}>
                        <span className={"text-white"}>Select a chat to start messaging</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
