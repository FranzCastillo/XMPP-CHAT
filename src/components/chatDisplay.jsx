import React, {useState, useEffect, useRef} from 'react';

function ChatDisplay({jid, presence="Available", presenceMessage="DEFAULT Presence", messages=[], sendMessage}) {
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const handleSendMessage = () => {
        if (inputValue.trim() !== "") {
            sendMessage(inputValue);
            setInputValue(""); // Clear the input field
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={"flex flex-col h-full"}>
            <div>
                {/* Displays the user information */}
                <div className={"flex flex-row items-center gap-2 p-2 border-b border-[#666666] w-full"}>
                    <div className={"w-10 h-10 rounded-full bg-[#666666]"}/>
                    <span className={"text-white"}>{jid}</span>
                    <span className={"text-[#666666]"}>{presenceMessage}</span>
                </div>
            </div>
            <div className={"flex-grow p-2 overflow-y-auto flex flex-col"}>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex flex-row ${msg.sender === "sent" ? "chat-end justify-end" : "chat-start justify-start"} pb-1`}>
                        <span className={"chat-bubble"}>{msg.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div>
                <input
                    type="text"
                    className={"w-full p-2"}
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
}

export default ChatDisplay;
