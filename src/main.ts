import { app, BrowserWindow, ipcMain, webContents } from "electron";
import libOicq from "./liboicq";
import * as path from "path";
import deleteDir from "./init";
import Queue from "./queue";

try {
  deleteDir(path.join(__dirname, "data"));
} catch (error) {
  
}

const queue = new Queue();
var sendMessage:NodeJS.Timer;
var oicq: libOicq;
var StepOneWindow: BrowserWindow;
var MainWindow: BrowserWindow;
//绘制主窗口
function createMainWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "ipcPerload.js"),
    },
    height: 600,
    width: 800,
    resizable: false,
    frame: false,
    autoHideMenuBar: true,
    show: false,
  });
  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  MainWindow = mainWindow;

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}
//绘制第一步窗口
function createLoginStepOneWindow() {
  const loginStepOneWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "ipcPerload.js"),
    },
    height: 230,
    width: 380,
    center: true,
    resizable: false,
    frame: false,
    autoHideMenuBar: true,
    show: false,
  });
  loginStepOneWindow.loadFile(path.join(__dirname, "../login-step-one.html"));
  loginStepOneWindow.on("ready-to-show", () => {
    loginStepOneWindow.show();
  });
  StepOneWindow = loginStepOneWindow;
}
//绘制二维码窗口
function createLoginStepTwoWindow() {
  const loginStepTwoWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "ipcPerload.js"),
    },
    height: 330,
    width: 200,
    center: true,
    resizable: false,
    frame: false,
    autoHideMenuBar: true,
    show: false,
  });
  loginStepTwoWindow.loadFile(path.join(__dirname, "../login-step-two.html"));
  loginStepTwoWindow.on("ready-to-show", () => {
    loginStepTwoWindow.show();
  });
  return loginStepTwoWindow;
}

app.on("ready", () => {
  createLoginStepOneWindow();
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    try {
      deleteDir(path.join(__dirname, "data"));
    } catch (error) {
      
    }
    app.quit();
  }


});

//收到登录信息
ipcMain.on('accountInfo', (event, data) => {
  //实例化一个oicq
  oicq = new libOicq(data[0].account.QQnumber, data[0].account.agreement);
  oicq.login();
  //获取登录二维码
  let qrcodeWindow: BrowserWindow;
  StepOneWindow.close(); //信息获取窗口关闭
  let callbackOfQrcode:Function = ()=> {
    qrcodeWindow = createLoginStepTwoWindow(); //创建二维码窗口
    let getQrcodeResult = setInterval(async () => { //定时获取二维码结果
      let result = await oicq.queryQrcodeResult();
      if (result.retcode == 0) {  //已扫码
        oicq.login(); //登录
        oicq.log().info("已扫码");
        clearInterval(getQrcodeResult); //清除定时器
        let loginResult = setInterval(() => { //定时获取登录结果
          if (oicq.isOnline) { //如果登录成功
            oicq.log().info("登录成功");
            clearInterval(loginResult); //清除定时器
            qrcodeWindow.close(); //关闭二维码窗口
            createMainWindow(); //创建主窗口
          }
        },1000);
      }
    }, 1500);
  }
  try {
    oicq.on("system.login.qrcode",callbackOfQrcode);
  } catch (error) {
    
  }
})

//发送二维码路径
ipcMain.on('getQrcode', (event) => {
  console.log('getQrcode');
  var path = `./dist/data/${oicq.qq}/qrcode.png`;
  event.sender.send('qrcode.path', path);
})
//发送信息列表
ipcMain.on('getFriendsAndGroupList',(et)=>{
  let list = oicq.getFriendsAndGroupList();
  et.sender.send('FriendsAndGroupList',list);
})
//发送消息
ipcMain.on('sendMessage',(event,data)=>{
  let friendList:number[] = data[0].friendList;
  let groupList:number[] = data[0].groupList;
  let message = data[0].message;
  let delay = data[0].delay;

  if(data[0].turnon == true){
    sendMessage = setInterval(()=>{
      sendMsgInTimer(friendList,groupList,message);
    },delay);
  }else{
    clearInterval(sendMessage);
  }
});
//收到窗口最小化信号
ipcMain.on('window-minimize',(event)=>{
  MainWindow.minimize();
});

function sendMsgInTimer(friendList:number[],groupList:number[],message:any) {
  queue.pushFriendsList(friendList);
  queue.pushGroupsList(groupList);
  var sendFriendsMessage = setInterval(() => {
    if (queue.isFriendsListEmpty()) {
      clearInterval(sendFriendsMessage);
      return;
    }
    let friend = queue.popFriends();
    oicq.client.sendPrivateMsg(friend, message);
  }, 1000);
  var sendGroupsMessage = setInterval(() => {
    if (queue.isGroupsListEmpty()) {
      clearInterval(sendGroupsMessage);
      return;
    }
    let group = queue.popGroups();
    oicq.client.sendGroupMsg(group, message);
  }, 1000);
}
