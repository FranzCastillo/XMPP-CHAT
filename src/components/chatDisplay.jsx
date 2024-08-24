import React, {useState, useEffect} from 'react';

function ChatDisplay({jid, presence="Available", presenceMessage="DEFAULT Presence", messages=[], sendMessage}) {
    const [inputValue, setInputValue] = useState("");

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
            <div className={"flex-grow overflow-y-auto"}>
                {/* Displays the chat messages */}
                {messages.map((msg, index) => (
                    <div key={index} className={"chat chat-end"}>
                        <div className={"chat-bubble"}>
                            {msg}
                        </div>
                    </div>
                ))}
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
