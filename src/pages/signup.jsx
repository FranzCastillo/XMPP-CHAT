import React, {useState} from "react";
import Password from "../assets/password.jsx";
import User from "../assets/user";
import Client from "../utils/xmpp/client";
import {useNavigate} from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const doNavigation = () => {
        navigate("/chat");
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username || !password || !confirmPassword) {
            setError("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Clean previous error
            setError("");

            Client.signup(username, password, doNavigation);
        } catch (e) {
            setError("Invalid username or password");
        }
    };

    return (
        <div className={"container mx-auto flex flex-col items-center justify-center p-5"}>
            <h1 className={"text-white text-3xl font-bold"}>
                Sign Up to Alumchat.lol
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

                <label
                    className="input input-bordered flex items-center gap-2 bg-transparent border-[#666666] border p-2 placeholder-[#666666] text-white">
                    <Password/>
                    <input type="password" className="grow" placeholder={"Confirm Password"}
                           onChange={(e) => setConfirmPassword(e.target.value)}/>
                </label>

                {error && <span className={"text-red-500"}>{error}</span>}
                <button type="submit" className={"bg-[#1ed760] text-black font-bold p-2 rounded-md"}>
                    Sign Up
                </button>
            </form>
            <hr className={"w-full my-5 border-1 border-[#666666]"}/>
            <span>
                Already have an account? <a href={"/login"} className={"text-white underline"}>Log In</a>
            </span>
        </div>
    );
};

export default Signup;
