import React from 'react';
import DeleteContact from "../assets/deleteContact";
import Client from "../utils/xmpp/client";

function RosterPreview({key, username}) {
    const handleRemoveContact = () => {
        console.log("Remove Contact Clicked");
        const jid = `${username}@alumchat.lol`;
        Client.removeContact(jid);
    };

    return (
        <div className="flex flex-row items-center justify-between p-2 cursor-pointer hover:bg-[#212121]">
            <div className="flex flex-row items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#666666]"/>
                <div className={"flex flex-col"}>
                    <span className="text-white">{username}</span>
                    <span className="text-[#666666] text-xs">Online</span>
                </div>
            </div>
            <button onClick={handleRemoveContact} className="btn bg-transparent border-none p-0 w-10 hover:bg-[#333333]">
                <DeleteContact/>
            </button>
        </div>
    );
}

export default RosterPreview;
