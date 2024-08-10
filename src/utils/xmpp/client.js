import { client, xml } from "@xmpp/client/browser";

class Client {
    constructor() {
        if (!Client.instance) {
            this.xmpp = null;
            Client.instance = this;
        }
        return Client.instance;
    }

    _setupClient() {
        this.xmpp.on("error", this.onError.bind(this));
        this.xmpp.on("offline", this.onOffline.bind(this));
        this.xmpp.on("stanza", this.onStanza.bind(this));
        this.xmpp.on("online", this.onOnline.bind(this));

        this.xmpp.start().catch(console.error);
    }

    login(username, password) {
        this.xmpp = client({
            service: import.meta.env.VITE_SERVICE,
            domain: import.meta.env.VITE_DOMAIN,
            username: username,
            password: password,
        });

        this._setupClient();
    }

    onError(err) {
        console.error(err);
    }

    onOffline() {
        console.log("offline");
    }

    onStanza(stanza) {
        console.log("stanza", stanza.toString());
    }

    async onOnline(address) {
        await this.xmpp.send(xml("presence"));
        const message = xml(
            "message",
            { type: "chat", to: address },
            xml("body", {}, "hello world"),
        );
        await this.xmpp.send(message);
    }
}

const instance = new Client();

export default instance;
