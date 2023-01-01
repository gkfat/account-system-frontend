# Account System full-stack project
此為會員系統全端專案。

* Demo：[https://gkfat.com](https://gkfat.com)
* API 文件：[API documentation](http://3.140.103.253:5000/api-docs/)
* 前端：[https://github.com/gkfat/account-system-frontend](https://github.com/gkfat/account-system-frontend)
* 後端：[https://github.com/gkfat/account-system-backend](https://github.com/gkfat/account-system-backend)

---
## Summary
### Features
* 使用者可透過三種方式註冊、登入帳號
* 驗證 email
* 取得使用者個人資料
* 重設密碼
* 以 cookies 保存登入狀態
* 登出

### Technology
* Hosting
    * AWS EC2
* Back-end
    * `Npm`: Project management
    * `Node.js`: API server
    * `Express`: API Server framework
    * `Typescript`: Static type checking
    * `Mariadb`: Database
    * `Typeorm`: Database orm
    * `Swagger`: API documentation
* Front-end
    * `Npm`: Project management
    * `Angular`: Front-end framework
    * `Typescript`: Static type checking
    * `Bootstrap`: CSS framework
    * `RxJS`: States control

---
## Features detail
#### Sign up 註冊功能
使用者可透過下列方式註冊帳號：
* Email & password，密碼須符合下列規則：
    * 包含至少一個小寫英文字元
    * 包含至少一個大寫英文字元
    * 包含至少一個數字字元
    * 包含至少一個特殊字元
    * 包含至少 8 個字元
* Google OAuth
* Facebook OAuth

#### Email verification 信箱驗證功能
* 透過 email 與自訂密碼註冊的使用者，系統會寄出一封帶有連結的驗證信，使用者點擊信中連結後，會開啟新分頁並直接登入
* 未驗證通過的使用者，無法進入主控版，會看到「重發驗證信」頁面
* 透過 Google、Facebook OAuth 註冊的使用者不需驗證信箱

#### Login 登入功能
使用者可透過下列方式登入：
* Email & password
* Google OAuth
* Facebook OAth

#### User profile 使用者個人頁面功能
* 使用者個人頁面會呈現 email、name 
* 使用者可修改並儲存名稱

#### Reset password 重設密碼功能
* 使用者可重置密碼

#### Cookies and logout 快取與登出功能
* Cookies 儲存在瀏覽器中，使用者下次進入網站時不用再次登入，可直接前往 profile 頁
* Logout 可清除 cookies

#### User database dashboard 使用者資料總覽功能
* 註冊的使用者清單，顯示下列資訊：
    * 使用者註冊時間 timestamp
    * 總登入次數
    * 上一次登入的時間
* 在清單的上方呈現下列資訊：
    * 使用者註冊總數
    * 今日活躍使用者總數
    * 過去 7 天，每天平均活躍使用者數量


---
## Specification

#### API routes
API docs avalaible on `http://{domain}:{port}/api-docs`, if you run this project locally, it will be http://localhost:5000/api-docs

#### Database entities

* Database(Mariadb) name: `account_system`

* Table name: `user`

|Column Name|Data Type|Notes|
|-|-|-|
|id|INT||
|createdAt|DATETIME||
|updatedAt|DATETIME||
|deletedAt|DATETIME||
|firstName|VARCHAR(255)||
|lastName|VARCHAR(255)||
|email|VARCHAR(255)|Unique|
|password|VARCHAR(255)||
|verificationCode|VARCHAR(255)||
|verified|TINYINT|Default `0`|

* Table name: `session`

|Column Name|Data Type|Notes|
|-|-|-|
|id|INT||
|createdAt|DATETIME||
|updatedAt|DATETIME||
|deletedAt|DATETIME||
|lastLoggedIn|DATETIME||
|accessToken|VARCHAR(255)||
|userId|INT|Foreign key to `user` table|

---
## Author info
* Author: gk
* Contact: gkgkdesign@gmail.com