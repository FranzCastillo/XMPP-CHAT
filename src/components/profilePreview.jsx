import React, {useState} from 'react';
import Menu from "../assets/menu";
import User from "../assets/user";

const ProfilePreview = ({username, onLogOut, onStatusChange, onAccDelete}) => {
    const [status, setStatus] = useState("Online")
    const handleStatusChange = (status) => {
        setStatus(status)
        onStatusChange(status)
    }
    return (
        <div className={"flex flex-row justify-between p-2 border-t border-[#666666] w-full"}>
            <div className={"flex flex-row items-center gap-2"}>
                <User width={30} height={30} fill={"#666666"}/>
                <div className={"flex flex-col"}>
                    <span className={"text-white pl-1"}>{username}</span>
                    <select
                        className={"bg-transparent text-[#b3b3b3] shadow-accent cursor-pointer text-xs"}
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="Online" className={"bg-[#212121] hover:bg-[#333333]"}>Online</option>
                        <option value="Not Available" className={"bg-[#212121] hover:bg-[#333333]"}>Not Available
                        </option>
                        <option value="Away" className={"bg-[#212121] hover:bg-[#333333]"}>Away</option>
                        <option value="Busy" className={"bg-[#212121] hover:bg-[#333333]"}>Busy</option>
                        <option value="Offline" className={"bg-[#212121] hover:bg-[#333333]"}>Offline</option>
                    </select>
                </div>
            </div>
            <div className="dropdown dropdown-top align-end">
                <div tabIndex="0" role="button"
                     className="btn m-1 bg-transparent border-none p-0 w-8 hover:bg-[#212121]">
                    <Menu/>
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
