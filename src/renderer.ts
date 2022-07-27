function friendsListTemplate(friends:{user_id: number; nickname: string;}[]) {
    let Friendslist='';
    friends.forEach((v)=>{
        let listItem = `
        <label class="mdui-list-item mdui-ripple">
        <div class="mdui-list-item-avatar">
          <img src="https://q1.qlogo.cn/g?b=qq&nk=${v.user_id}&s=640" />
        </div>
        <div class="mdui-list-item-content">${v.nickname}</div>
        <div class="mdui-checkbox">
          <input type="checkbox" name="friends" data-friendsQQ="${v.user_id}"/>
          <i class="mdui-checkbox-icon"></i>
        </div>
      </label>
        `
        Friendslist+=listItem;
    })
    return Friendslist;
}
function groupsListTemplate(groups: {group_id: number;group_name: string;}[]){
    let groupsList='';
    groups.forEach((v)=>{
        let listItem = `
        <label class="mdui-list-item mdui-ripple">
        <div class="mdui-list-item-avatar">
          <img src="http://p.qlogo.cn/gh/${v.group_id}/${v.group_id}/100/" />
        </div>
        <div class="mdui-list-item-content">${v.group_name}</div>
        <div class="mdui-checkbox">
          <input type="checkbox" name="groups" data-groupsQQ="${v.group_id}"/>
          <i class="mdui-checkbox-icon"></i>
        </div>
      </label>
        `
        groupsList+=listItem;
    });
    return groupsList;
}
function renderFriendsList(friends:{user_id: number; nickname: string;}[]) {
    let list = friendsListTemplate(friends);
    document.getElementById('friendList').innerHTML = list;
}
function renderGroupsList(groups: {group_id: number;group_name: string;}[]){
    let list = groupsListTemplate(groups);
    document.getElementById('groupList').innerHTML = list;
}
function render(friends: {user_id: number; nickname: string;}[],groups: {group_id: number;group_name: string;}[]){
    renderFriendsList(friends);
    renderGroupsList(groups);
}