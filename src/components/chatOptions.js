import React from 'react';
import Search from "../assets/search";

const ChatOptions = () => {
    return (
        <div className={"flex flex-row items-center justify-between p-2 gap-2"}>
            <label className="input input-bordered flex items-center gap-2 bg-transparent border-[#666666] border p-2 placeholder-[#666666] text-white h-10">
                <input type="text" className="w-full" placeholder={"Search"}/>
                <Search/>
            </label>
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn m-1 bg-[#0a59b8] hover:bg-[#1ed760] text-white hover:text-black">+</div>
                <ul tabIndex={0} className="dropdown-content menu bg-[#212121] rounded-box z-[1] w-40 p-2 shadow">
                    <li><a>Start Chat...</a></li>
                    <li><a>Create Group Chat...</a></li>
                    <li><a>Add Contact...</a></li>
                </ul>
            </div>
        </div>
    );
};

export default ChatOptions;
