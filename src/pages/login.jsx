import React, {useState} from "react";
import Password from "../assets/password.jsx";
import User from "../assets/user";
import Client from "../utils/xmpp/client";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const doNavigation = () => {
        navigate("/chat");
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            // Clean previous error
            setError("");

            Client.login(username, password, doNavigation);
        } catch (e) {
            setError("Invalid username or password");
        }
    };

    return (
        <div className={"container mx-auto flex flex-col items-center justify-center p-5"}>
            <h1 className={"text-white text-3xl font-bold"}>
                Login to Alumchat.lol
            </h1>
            <hr className={"w-full my-5 border-1 border-[#666666]"}/>
            <form className={"flex flex-col w-full gap-2"} onSubmit={handleSubmit}>
                <label
                    className="input input-bordered flex items-center gap-2 bg-transparent border-[#666666] border p-2 placeholder-[#666666] text-white">
                    <User/>
                    <input type="text" className="grow" placeholder={"Username"}
                           onChange={(e) => setUsername(e.target.value)}/>
                </label>

                <label
                    className="input input-bordered flex items-center gap-2 bg-transparent border-[#666666] border p-2 placeholder-[#666666] text-white">
                    <Password/>
                    <input type="password" className="grow" placeholder={"Password"}
                           onChange={(e) => setPassword(e.target.value)}/>
                </label>
                {error && <span className={"text-red-500"}>{error}</span>}
                <button type="submit" className={"bg-[#1ed760] text-black font-bold p-2 rounded-md"}>
                    Log In
                </button>
            </form>
            <hr className={"w-full my-5 border-1 border-[#666666]"}/>
            <span>
                Don&apos;t have an account? <a href={"/signup"} className={"text-white underline"}>Sign Up</a>
            </span>
        </div>
    );
};

export default Login;
