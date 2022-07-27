//消息队列
export default class Queue {
    queueFriends: number[];
    queueGroups: number[];
    constructor() {
        this.queueFriends = [];
        this.queueGroups = [];
    }
    pushFriendsList(item:number[]) {
        this.queueFriends.push(...item);
    }
    pushGroupsList(item:number[]) {
        this.queueGroups.push(...item);
    }
    popFriends() {
        return this.queueFriends.shift();
    }
    popGroups() {
        return this.queueGroups.shift();
    }
    isFriendsListEmpty() {
        return this.queueFriends.length === 0;
    }
    isGroupsListEmpty() {
        return this.queueGroups.length === 0;
    }
}