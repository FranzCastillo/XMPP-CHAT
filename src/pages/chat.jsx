import React, {useState, useEffect} from 'react';
import Sidebar from "../components/sidebar";
import ChatDisplay from "../components/chatDisplay";
import client from "../utils/xmpp/client";
import Swal from 'sweetalert2';

const Chat = (props) => {
    const [displayedChat, setDisplayedChat] = useState(null);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        client.setMessageCallback((jid, message) => {
            setMessages(prevMessages => ({
                ...prevMessages,
                [jid]: [...(prevMessages[jid] || []), {text: message, sender: 'received'}]
            }));

            if (jid !== displayedChat) {
                Swal.fire({
                    position: "top-end",
                    title: `New message from ${jid}`,
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false,
                    customClass: {
                        popup: "bg-[#2d2d2d] text-white p-2 w-48",
                        title: "text-white text-sm",
                        icon: "w-4 h-4"
                    }
                });
            }
        });
    }, [displayedChat]);

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
