import React from 'react';
import ProfilePreview from "./profilePreview";
import ChatOptions from "./chatOptions";
import ChatPreview from "./chatPreview";
import Client from "../utils/xmpp/client";
import {useNavigate} from "react-router-dom";

const Sidebar = ({messages}) => {
    messages = [{username: "John Doe", message: "Hello"}, {username: "Jane Do243423342S324e", message: "Hiwerasdsadfadssasdasdasd"}]

    const navigate = useNavigate();

    const doNavigationLogOut = () => navigate("/login");

    return (
        <div className={"w-1/6 h-screen bg-[#1c1c1c] border-r border-[#666666] flex flex-col justify-between min-w-[226px]"}>
            <div>
                <span className={"text-white font-bold p-2"}>Alumchat.lol</span>
                <ChatOptions/>
            </div>
            {messages && <div className={"w-full h-full"}>
                {messages.map((message, index) => (
                    <ChatPreview key={index} username={message.username} message={message.message}
                                 image={message.image}/>
                ))}
            </div>}
            {!messages && <div className={"w-full h-full flex items-center justify-center"}>
                <span className={"text-white"}>No messages</span>
            </div>}
            <ProfilePreview
                username={Client.username}
                status={"Online"}  // TODO: Get status from XMPP client
                onLogOut={() => Client.logout(doNavigationLogOut)}
                onStatusChange={(status) => console.log(status)}  // TODO: Implement status change
                onAccDelete={() => console.log("Deleting account")}  // TODO: Implement account deletion
            />
        </div>
    );
};

export default Sidebar;
