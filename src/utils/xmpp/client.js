import {client, xml} from "@xmpp/client/browser";

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
            await this.xmpp.send(xml("presence", {type: "unavailable"}));
            this.xmpp.stop();
            this.xmpp = null;

            doNavigation();
        }
    }

    async changePresence(status, statusMessage = "") {
        console.log("Attempting to set status to", status, "with message:", statusMessage);
        if (this.xmpp) {
            const presenceMap = {
                "Available": "chat",
                "Not Available": "xa",
                "Away": "away",
                "Busy": "dnd",
                "Offline": null
            };

            const show = presenceMap[status];

            if (show === undefined) {
                console.error("Unknown status:", status);
                return;
            }

            if (status === "Offline") {
                await this.xmpp.send(xml("presence", {type: "unavailable"}));
                return;
            }

            // Include both the show and status fields in the presence stanza
            const presenceStanza = xml("presence", {},
                show ? xml("show", {}, show) : null,
                statusMessage ? xml("status", {}, statusMessage) : null
            );

            console.log("Sending presence stanza:", presenceStanza.toString());
            await this.xmpp.send(presenceStanza);
        }
    }


    async getRoster() {
        if (this.xmpp) {
            const rosterRequest = xml(
                "iq",
                {type: "get", id: "get_roster"},
                xml("query", {xmlns: "jabber:iq:roster"})
            );
            await this.xmpp.send(rosterRequest);
        }
    }

    async removeContact(jid) {
        if (this.xmpp) {
            const removeRequest = xml(
                "iq",
                {type: "set", id: "remove_contact"},
                xml("query", {xmlns: "jabber:iq:roster"},
                    xml("item", {jid, subscription: "remove"})
                )
            );
            await this.xmpp.send(removeRequest);
        }
    }

    async getPresence(jid) {
        if (this.xmpp) {
            const presenceRequest = xml(
                "iq",
                {type: "get", id: "get_presence"},
                xml("query", {xmlns: "jabber:iq:roster"},
                    xml("item", {jid})
                )
            );
            await this.xmpp.send(presenceRequest);
        }
    }

    async getPresenceMessage(jid) {
        if (this.xmpp) {
            const presenceRequest = xml(
                "iq",
                {type: "get", id: "get_presence"},
                xml("query", {xmlns: "jabber:iq:roster"},
                    xml("item", {jid})
                )
            );
            await this.xmpp.send(presenceRequest);
        }
    }

    setMessageCallback(callback) {
        this.messageCallback = callback;
    }

    setPresenceUpdateCallback(callback) {
        this.presenceUpdateCallback = callback;
    }


    async addContact(jid) {
        if (this.xmpp) {
            const addRequest = xml(
                "iq",
                {type: "set", id: "add_contact"},
                xml("query", {xmlns: "jabber:iq:roster"},
                    xml("item", {jid, name: jid.split("@")[0]})
                )
            );
            await this.xmpp.send(addRequest);

            const subscribeRequest = xml(
                "presence",
                {type: "subscribe", to: jid}
            );
            await this.xmpp.send(subscribeRequest);
        }
    }

    setRosterUpdateCallback(callback) {
        this.rosterUpdateCallback = callback;
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

        if (stanza.is("message") && stanza.attrs.type === "chat") {
            const jid = stanza.attrs.from.split("/")[0];
            const body = stanza.getChildText("body");
            if (this.messageCallback && body) {
                this.messageCallback(jid, body);
            }
        } else if (stanza.is("iq") && stanza.attrs.type === "result") {
            if (stanza.attrs.id === "get_roster" && stanza.getChild("query", "jabber:iq:roster")) {
                const items = stanza.getChild("query").getChildren("item");
                const roster = items.map(item => ({
                    jid: item.attrs.jid,
                    name: item.attrs.name,
                    subscription: item.attrs.subscription
                }));
                if (this.rosterUpdateCallback) {
                    this.rosterUpdateCallback(roster);
                }
            } else if (stanza.attrs.id === "remove_contact" || stanza.attrs.id === "add_contact") {
                // Fetch the updated roster after removing a contact
                this.getRoster();
            }
        } else if (stanza.is("presence")) {
            const jid = stanza.attrs.from;
            const presence = stanza.getChildText("show") || "Available";
            if (this.presenceUpdateCallback) {
                const presenceMap = {
                    chat: "Available",
                    xa: "Not Available",
                    away: "Away",
                    dnd: "Busy"
                };
                this.presenceUpdateCallback(jid.split("/")[0], presenceMap[presence] || presence);
            }
        } else if (stanza.is("iq") && stanza.attrs.type === "result" && stanza.getChild("vCard")) {
            const vCard = stanza.getChild("vCard").getChildText("FN");
            console.log("vCard", vCard);
        }
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
