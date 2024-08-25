import React, {useState, useEffect} from 'react';
import Sidebar from "../components/sidebar";
import ChatDisplay from "../components/chatDisplay";
import client from "../utils/xmpp/client";
import Swal from 'sweetalert2';

const Chat = () => {
    const [displayedChat, setDisplayedChat] = useState(null);  // Stores the JID of the chat being displayed
    const [messages, setMessages] = useState({});  // Stores the messages for each chat. The key is the JID and the value is an array of messages
    const [presenceStatus, setPresenceStatus] = useState({});  // Stores the presence status for each chat. The key is the JID and the value is the status
    const [statusMessages, setStatusMessages] = useState({});  // Stores the status message for each chat. The key is the JID and the value is the message

    useEffect(() => {
        // Set the function to be called when a message is received
        client.setMessageCallback((jid, message) => {
            setMessages(prevMessages => ({
                ...prevMessages,
                [jid]: [...(prevMessages[jid] || []), {text: message, sender: 'received'}]  // The sender key is used to display on the right side of the chat
            }));

            if (jid !== displayedChat) {  // If the chat is not currently displayed, show a notification
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

        //  Set the function to be called when the presence status is updated
        client.setStatusUpdateCallback((jid, statusMessage) => {
            setStatusMessages(prevStatusMessages => ({
                ...prevStatusMessages,
                [jid]: statusMessage
            }));

            // Re-render the chat display if the status message belongs to the displayed chat
            if (jid === displayedChat) {
                setDisplayedChat(jid);  // This will trigger a re-render
            }
        });
    }, [displayedChat]);

    // To be called when the user sends a message
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
                        presence={presenceStatus[displayedChat] || "Available"}
                        presenceMessage={statusMessages[displayedChat] || ""}
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
