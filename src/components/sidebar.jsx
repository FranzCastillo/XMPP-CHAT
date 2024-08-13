import React, {useState, useEffect} from 'react';
import ProfilePreview from "./profilePreview";
import Client from "../utils/xmpp/client";
import {useNavigate} from "react-router-dom";
import RosterPreview from "./RosterPreview";
import Refresh from "../assets/refresh";
import Search from "../assets/search";

const Sidebar = ({messages}) => {
    const navigate = useNavigate();
    const [roster, setRoster] = useState([]);
    useEffect(() => {
        Client.setRosterUpdateCallback((updatedRoster) => {
            console.log("Roster Updated:", updatedRoster);
            setRoster(updatedRoster);
        });
        Client.getRoster();
    }, []);

    const [search, setSearch] = useState("");
    const filteredRoster = roster.filter(item => {
            item.name = item.jid.split("@")[0];
            return item.name.toLowerCase().includes(search.toLowerCase());
        }
    );

    const doNavigationLogOut = () => navigate("/login");

    const handleAddContactSubmit = (event) => {
        event.preventDefault();
        const username = event.target.elements.username.value;
        const jid = `${username}@alumchat.lol`;
        Client.addContact(jid);
        document.getElementById('contact_modal').close();
    };

    return (
        <div
            className={"w-1/6 h-screen bg-[#1c1c1c] border-r border-[#666666] flex flex-col justify-between min-w-[226px]"}>
            <div>
                <span className={"text-white font-bold p-2"}>Alumchat.lol</span>
                <div className={"flex flex-row items-center justify-between p-2 gap-2 border-b border-[#666666]"}>
                    <label
                        className="input input-bordered flex items-center gap-2 bg-transparent border-[#666666] border p-2 placeholder-[#666666] text-white h-10">
                        <input type="text" className="w-full" placeholder={"Search"}
                               onChange={(e) => setSearch(e.target.value)}/>
                        <Search/>
                    </label>
                    <div className="dropdown">
                        <div tabIndex={0} role="button"
                             className="btn m-1 bg-[#0a59b8] hover:bg-[#1ed760] text-white hover:text-black">+
                        </div>
                        <ul tabIndex={0}
                            className="dropdown-content menu bg-[#212121] rounded-box z-[1] w-40 p-2 shadow">
                            <li><a>Start Chat...</a></li>
                            <li><a>Create Group Chat...</a></li>
                            <li>
                                <a onClick={() => document.getElementById('contact_modal').showModal()}>Add
                                    Contact...</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <dialog id="contact_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add Contact</h3>
                        <p className="py-4">Who do you want to add?</p>
                        <form method="dialog" onSubmit={handleAddContactSubmit}>
                            <label className="form-label">Username</label>
                            <input type="text" name="username" className="form-input" placeholder="Username"/>
                            <div className="modal-action">
                                <button type="submit" className="btn">Add</button>
                                <button type="button" className="btn"
                                        onClick={() => document.getElementById('contact_modal').close()}>Close
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            </div>
            <div className={"w-full h-full overflow-y-auto"}>
                <div className={"flex items-center justify-between"}>
                    <span className={"text-white font-bold p-2"}>Roster</span>
                    <button
                        onClick={() => Client.getRoster()}
                        className={"text-white p-6"}>
                        <div className={"flex items-center justify-center"}>
                            <Refresh/>
                        </div>
                    </button>
                </div>
                <hr className={"border-[#666666] w-full"}/>
                <div className={"flex flex-col"}>
                    {filteredRoster.map((item, index) => {
                        item.name = item.jid.split("@")[0];
                        return (
                            <RosterPreview key={index} username={item.name}/>
                        )
                    })}
                </div>
                {filteredRoster.length === 0 && (
                    <div className={"flex items-center justify-center h-32"}>
                        <span className={"text-white"}>No contacts found</span>
                    </div>

                )}
            </div>
            <ProfilePreview
                username={Client.username}
                onLogOut={() => Client.logout(doNavigationLogOut)}
                onStatusChange={(status) => Client.changePresence(status)}
                onAccDelete={() => console.log("Deleting account")}  // TODO: Implement account deletion
            />
        </div>
    );
};

export default Sidebar;
