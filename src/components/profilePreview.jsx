import React from 'react';

const ProfilePreview = ({username, status, onLogOut, onStatusChange, onAccDelete}) => {
    return (
        <div className={"flex flex-row justify-between p-2 border-t border-[#666666] w-full"}>
            <div className={"flex flex-col w-2/3"}>
                <span className={"text-white font-bold truncate"}>{username}</span>
                <select
                    className={"bg-transparent text-[#b3b3b3] border-none outline-none cursor-pointer"}
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    <option value="Online" className={"bg-[#212121] hover:bg-[#333333]"}>Online</option>
                    <option value="Not Available" className={"bg-[#212121] hover:bg-[#333333]"}>Not Available</option>
                    <option value="Away" className={"bg-[#212121] hover:bg-[#333333]"}>Away</option>
                    <option value="Busy" className={"bg-[#212121] hover:bg-[#333333]"}>Busy</option>
                    <option value="Offline" className={"bg-[#212121] hover:bg-[#333333]"}>Offline</option>
                </select>
            </div>
            <div className="dropdown dropdown-top align-end">
                <div tabIndex="0" role="button"
                     className="btn m-1 bg-transparent border-none p-0 w-8 hover:bg-[#212121]">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <span className="block w-1 h-1 bg-white rounded-full"></span>
                        <span className="block w-1 h-1 bg-white rounded-full"></span>
                        <span className="block w-1 h-1 bg-white rounded-full"></span>
                    </div>
                </div>
                <ul tabIndex="0" className="dropdown-content menu bg-[#212121] rounded-box z-[1] w-fit p-2 shadow">
                    <li><a onClick={onLogOut}>Log Out</a></li>
                    <li><a onClick={onAccDelete}>Delete Account</a></li>
                </ul>
            </div>
        </div>
    );
}

export default ProfilePreview;
