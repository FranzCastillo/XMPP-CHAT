import React from 'react';
import ProfilePreview from "../components/profilePreview";

const Chat = (props) => (
    <div className={"flex flex-row"}>
        <div className={"w-1/6 h-screen bg-[#1c1c1c] border-r border-[#666666] min-w-[200px]"}>
            <ProfilePreview username={"John Doe"} status={"Online"}/>
        </div>
    </div>
);

export default Chat;
