import React, {useEffect, useState} from 'react';
import Client from "../utils/xmpp/client";
import Menu from "../assets/menu";

function RosterPreview({key, username}) {
    const jid = `${username}@alumchat.lol`;

    const [presence, setPresence] = useState("Online");
    useEffect(() => {
        Client.setPresenceUpdateCallback((jid, presence) => {
            if (jid === jid) {
                setPresence(presence);
            }
        });
        Client.getPresence(jid);
    }, []);


    const handleRemoveContact = () => {
        Client.removeContact(jid);
    };

    const handleInformation = () => {
        Client.getVCard(jid);
    }

    return (
        <div className="flex flex-row items-center justify-between p-2 cursor-pointer hover:bg-[#212121] relative">
            <div className="flex flex-row items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#666666]"/>
                <div className={"flex flex-col"}>
                    <span className="text-white truncate w-32">{username}</span>
                    <span className="text-[#666666] text-xs">{presence}</span>
                </div>
            </div>
            <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex="0" role="button"
                     className="btn m-1 bg-transparent border-none p-0 w-8 hover:bg-[#212121]">
                    <Menu/>
                </div>
                <ul tabIndex="0" className="dropdown-content menu bg-[#212121] rounded-box z-[1] w-fit p-2 shadow">
                    <li><a onClick={handleInformation}>Information</a></li>
                    <li><a onClick={handleRemoveContact}>Remove Contact</a></li>
                </ul>
            </div>
        </div>
    );
}

export default RosterPreview;
