import client from "/src/utils/xmpp/client.js";

const Login = ({ username, password }) => {
    client.login(username, password);
};

export default Login;
