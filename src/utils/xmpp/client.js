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

    // Set up the XMPP client and start it
    _setupClient(doNavigation) {
        try {
            this.xmpp.on("error", this.onError.bind(this));
            this.xmpp.on("offline", this.onOffline.bind(this));
            this.xmpp.on("stanza", this.onStanza.bind(this));
            this.xmpp.on("online", (address) => this.onOnline(address, doNavigation));  // When a client successfully logs in

            this.xmpp.start();
        } catch (err) {
            this.onError(err);
        }
    }

    // Register a new account
    async signup(username, password, doNavigation) {
        // Login as a root user to register a new account (needs a pre-existing account)
        this.login("cas21562-root", "cas21562", async () => {
            const registerRequest = xml(
                "iq",
                {type: "set", id: "register_1", to: this.domain},
                xml("query", {xmlns: "jabber:iq:register"},
                    xml("username", {}, username),
                    xml("password", {}, password)
                )
            );

            await this.xmpp.send(registerRequest);

            // Handle the registration response
            this.xmpp.on("stanza", async (stanza) => {
                if (stanza.is("iq") && stanza.attrs.id === "register_1") {
                    if (stanza.attrs.type === "result") {
                        console.log(`Registration successful for ${username}`);

                        this.login(username, password, doNavigation);  // Log in with the new account
                    } else if (stanza.attrs.type === "error") {
                        console.error("Registration failed:", stanza.toString());
                    }
                }
            });
        });
    }

    // Log in to an existing account
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

    // Delete the account
    async deleteAccount(doNavigation) {
        if (this.xmpp) {
            // Send the unregister request to delete the account
            const deleteRequest = xml(
                "iq",
                {type: "set", id: "unregister_1", to: this.domain},
                xml("query", {xmlns: "jabber:iq:register"},
                    xml("remove")
                )
            );

            await this.xmpp.send(deleteRequest);

            this.xmpp.on("stanza", async (stanza) => {
                if (stanza.is("iq") && stanza.attrs.id === "unregister_1") {
                    if (stanza.attrs.type === "result") {
                        console.log("Account deletion successful");

                        // Log out after deleting the account
                        await this.logout(doNavigation);
                    } else if (stanza.attrs.type === "error") {
                        console.error("Account deletion failed:", stanza.toString());
                    }
                }
            });
        }
    }

    // Log out of the account
    async logout(doNavigation) {
        if (this.xmpp) {
            // Send unavailable presence to indicate logout
            await this.xmpp.send(xml("presence", {type: "unavailable"}));
            this.xmpp.stop();
            this.xmpp = null;

            doNavigation();
        } else {
            doNavigation();
        }
    }

    // Change the presence status
    async changePresence(status, statusMessage = "") {
        if (this.xmpp) {
            // Maps the status to the corresponding XMPP presence show value
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

            await this.xmpp.send(presenceStanza);
        }
    }

    // Fetch the roster
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

    // Removes a contact of the roster
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

    // Fetch the presence of a contact
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

    setMessageCallback(callback) {
        this.messageCallback = callback;
    }

    setPresenceUpdateCallback(callback) {
        this.presenceUpdateCallback = callback;
    }

    // Add a contact to the roster
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

            // Send a subscription request to the contact
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

    // Send a message to a contact
    async sendMessage(jid, message) {
        if (this.xmpp) {
            const messageStanza = xml(
                "message",
                {to: jid, type: "chat"},
                xml("body", {}, message)
            );
            await this.xmpp.send(messageStanza);
        }
    }

    setStatusUpdateCallback(callback) {
        this.statusUpdateCallback = callback;
    }

    // Listener for all incoming stanzas
    onStanza(stanza) {
        console.log("STANZA\n", stanza.toString());

        if (stanza.is("message") && stanza.attrs.type === "chat") {  // Handle incoming messages
            const jid = stanza.attrs.from.split("/")[0];
            const body = stanza.getChildText("body");
            if (this.messageCallback && body) {
                this.messageCallback(jid, body);  // Call the message callback to be displayed or send a notification
            }
        } else if (stanza.is("iq") && stanza.attrs.type === "result") {  // Handle IQ responses (roster, presence, etc.)
            if (stanza.attrs.id === "get_roster" && stanza.getChild("query", "jabber:iq:roster")) {  // Handle roster response
                const items = stanza.getChild("query").getChildren("item");
                const roster = items.map(item => ({
                    jid: item.attrs.jid,
                    name: item.attrs.name,
                    subscription: item.attrs.subscription
                }));
                if (this.rosterUpdateCallback) {
                    this.rosterUpdateCallback(roster);  // Update the roster in the UI
                }
            } else if (stanza.attrs.id === "remove_contact" || stanza.attrs.id === "add_contact") {  // Handle contact removal or addition
                // Fetch the updated roster after removing or adding a contact
                this.getRoster();
            }
        } else if (stanza.is("presence")) {  // Handle presence stanzas
            const jid = stanza.attrs.from;
            const presence = stanza.getChildText("show") || "chat";  // Stores the show attribute of the stanza
            const status = stanza.getChildText("status") || null;

            // Handle incoming subscription requests
            if (stanza.attrs.type === "subscribe") {
                // Automatically approve the subscription request
                const subscribedResponse = xml("presence", {
                    type: "subscribed",
                    to: jid
                });
                this.xmpp.send(subscribedResponse);

                // Send a subscription request back to the contact if not already sent
                const subscribeResponse = xml("presence", {
                    type: "subscribe",
                    to: jid
                });

                this.xmpp.send(subscribeResponse);
            } else if (stanza.attrs.type === "subscribed") {
                console.log(`${jid} accepted your subscription request.`);
            } else if (stanza.attrs.type === "unsubscribed") {
                console.log(`${jid} declined your subscription request.`);
            }

            // Only update if status is not empty
            if (status !== null && this.presenceUpdateCallback) {
                const presenceMap = {
                    chat: "Available",
                    xa: "Not Available",
                    away: "Away",
                    dnd: "Busy"
                };
                this.presenceUpdateCallback(jid.split("/")[0], presenceMap[presence] || presence);
            }

            // Update status if it's meaningful and not the user's own status
            if (this.statusUpdateCallback && jid.split("/")[0] !== this.username && status) {
                this.statusUpdateCallback(jid.split("/")[0], status);
            }
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
