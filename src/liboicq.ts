import { Client, Config, createClient } from "oicq";

export default class libOicq {
    constructor(Qid: number, platform: number) {
        this.qq = Qid;
        this.config = {
            platform: platform,
            cache_group_member: false,
            log_level: "off",
        }
        this.client = createClient(Qid, this.config);
    }
    client: Client;
    config: Config;
    qq: number;

    login() {
        this.client.login();
    }

    on(event: string, callback: Function) {
        this.client.on(event, callback());
    }

    queryQrcodeResult() {
        return this.client.queryQrcodeResult();
    }

    isOnline() {
        return this.client.isOnline();
    }

    log() {
        this.client.getGroupList
        return this.client.logger;
    }

    getFriendsAndGroupList() {
        let list: {
            friends: { user_id: number; nickname: string; }[],
            groups: { group_id: number; group_name: string; }[]
        }
        let _friends = this.client.getFriendList();
        let _groups = this.client.getGroupList();
        let friends: { user_id: number; nickname: string; }[] = [];
        let groups: { group_id: number; group_name: string; }[] = [];
        _friends.forEach((v) => {
            friends.push({
                user_id: v.user_id,
                nickname: v.nickname
            }) 
        });
        _groups.forEach((v) => {
            groups.push({
                group_id: v.group_id,
                group_name: v.group_name
            })
        });
        list = {
            friends: friends,
            groups: groups
        }
        return list;
    }
}