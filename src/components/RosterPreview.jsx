import React from 'react';

function RosterPreview({key, username}) {
    return (
        <div className="flex flex-row items-center gap-2 p-2 hover:bg-[#333333]">
            <div className="w-10 h-10 rounded-full bg-[#666666]"/>
            <div className={"flex flex-col"}>
                <span className="text-white truncate w-40">{username}</span>
            </div>
        </div>
    );
}

export default RosterPreview;
