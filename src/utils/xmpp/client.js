import { client, xml } from "@xmpp/client/browser";

class Client {
    constructor() {
        if (!Client.instance) {
            this.xmpp = client({
                service: "ws://alumchat.lol:7070/ws/",
                domain: "alumchat.lol",
                username: "",
                password: "",
            });
            Client.instance = this;
        }
        return Client.instance;
    }

    _setupClient(doNavigation) {
        try {
            this.xmpp.on("error", this.onError.bind(this));
            this.xmpp.on("offline", this.onOffline.bind(this));
            this.xmpp.on("stanza", this.onStanza.bind(this));
            this.xmpp.on("online", (address) => this.onOnline(address, doNavigation));

            this.xmpp.start();
        } catch (err) {
            this.onError(err);
        }
    }

    login(username, password, doNavigation) {
        this.xmpp = client({
            service: "ws://alumchat.lol:7070/ws/",
            domain: "alumchat.lol",
            username,
            password,
        });

        this._setupClient(doNavigation);
    }

    onError(err) {
        console.error(err);
        this.xmpp.stop();
    }

    onOffline() {
        console.log("offline");
    }

    onStanza(stanza) {
        console.log("STANZA\n", stanza.toString());
    }

    async onOnline(address, doNavigation) {
        if (doNavigation) {
            doNavigation();
        }

        // Send presence
        await this.xmpp.send(xml("presence"));
    }
}

const instance = new Client();

export default instance;
