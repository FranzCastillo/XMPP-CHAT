import React from 'react';
import ProfilePreview from "./profilePreview";
import ChatOptions from "./chatOptions";

const Sidebar = () => {
    return (
        <div className={"w-1/6 h-screen bg-[#1c1c1c] border-r border-[#666666] min-w-[200px]"}>
            <span className={"text-white font-bold p-2"}>Alumchat.lol</span>
            <ChatOptions/>
            <ProfilePreview username={"John Doe"} status={"Online"}/>
        </div>
    );
};

export default Sidebar;
