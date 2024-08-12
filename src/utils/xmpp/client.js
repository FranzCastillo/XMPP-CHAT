import { client, xml } from "@xmpp/client/browser";

class Client {
    constructor() {
        if (!Client.instance) {
            this.xmpp = "ws://alumchat.lol:7070/ws/";
            this.domain = "alumchat.lol";
            this.username = "cas21562";
            this.password = "cas21562";
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
        this.username = username;
        this.password = password;
        this.xmpp = client({
            service: "ws://alumchat.lol:7070/ws/",
            domain: "alumchat.lol",
            username,
            password,
        });

        this._setupClient(doNavigation);
    }

    async logout(doNavigation) {
        if (this.xmpp) {
            // Send unavailable presence to indicate logout
            await this.xmpp.send(xml("presence", { type: "unavailable" }));
            this.xmpp.stop();
            this.xmpp = null;

            doNavigation();
        }
    }

    async changePresence(status) {
        console.log("Set status to", status);
        if (this.xmpp) {
            await this.xmpp.send(xml("presence", {}, xml("status", {}, status)));
        }
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
