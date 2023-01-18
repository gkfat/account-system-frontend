# GK's Playground project
此為 GK 遊樂場專案。
* Author：[GK](https://github.com/gkfat)
* Contact：gkgkdesign@gmail.com

---
## Summary
### Links
* Demo：[https://gkfat.com](https://gkfat.com)
* API 文件：[API documentation](http://3.140.103.253:5000/api-docs/)
* 前端：[https://github.com/gkfat/gk-playground-frontend](https://github.com/gkfat/gk-playground-frontend)
* 後端：[https://github.com/gkfat/gk-playground-backend](https://github.com/gkfat/gk-playground-backend)

### Features
* 會員系統
    - [x] 可進行註冊、登入、登出
    - [x] 可變更個人資訊（姓名、暱稱、密碼）
    - [x] Social OAuth Login
    - [x] Email validatoin
    - [ ] 管理員可將使用者登出
* 部落格系統
    - [x] 可發佈、編輯貼文
    - [x] 管理員可發佈公告
    - [x] 可造訪其他使用者動態牆
    - [ ] 可對貼文發佈、編輯留言
* 裝飾系統（頭像、邊框）
    - [x] 可變更裝飾件
    - [x] 管理員可新增、移除裝飾件
* 等級系統
    - [ ] 可累積經驗提升等級
    - [ ] 等級提升可獲得新邊框、頭像
* GKBOT 生存之戰
    * 敬請期待

### Technology
* Hosting
    * `AWS EC2`: Hosting management
* Back-end
    * `Npm 8`: Project management
    * `Node.js 16`: Develop language
    * `Express 4`: API Server framework
    * `Typescript 4`: Static type checking
    * `Nodemailer 6`: Email service
    * `Mysql 2`: Database
    * `Typeorm 0.3`: Database orm
    * `Swagger 4`: API documentation
* Front-end
    * `Npm 8`: Project management
    * `Angular 14`: Front-end framework
    * `Typescript 4`: Static type checking
    * `NG Bootstrap 13`: CSS framework
    * `NgRx 14`: States control by using RxJS
    * `Angularx-social-login 1`: Social OAuth login

---
## Specification

### API routes & schemas
API docs avalaible on `http://{domain}:{port}/api-docs`, if you run this project locally, it will be http://localhost:5000/api-docs

### Database entities

* Database name: `gk_playground`

* Table name: `user`

|Column Name|Data Type|Notes|
|-|-|-|
|id|`INT`|Primary key|
|createdAt|`DATETIME`||
|updatedAt|`DATETIME`||
|deletedAt|`DATETIME`||
|email|`VARCHAR(100)`|Unique|
|firstName|`VARCHAR(100)`||
|lastName|`VARCHAR(100)`||
|nickName|`VARCHAR(100)`||
|roleLevel|`INT`||
|level|`INT`||
|experience|`INT`||
|avatarId|`INT`||
|frameId|`INT`||
|password|`VARCHAR(100)`||
|verificationCode|`LONGTEXT`||
|verified|`TINYINT`|Default `0`|

* Table name: `session`

|Column Name|Data Type|Notes|
|-|-|-|
|id|`INT`|Primary key|
|createdAt|`DATETIME`||
|updatedAt|`DATETIME`||
|deletedAt|`DATETIME`||
|lastLoggedIn|`DATETIME`||
|accessToken|`LONGTEXT`||
|refreshToken|`LONGTEXT`||
|userId|`INT`|Foreign key to `user` table|

* Table name: `post`

|Column Name|Data Type|Notes|
|-|-|-|
|id|`INT`|Primary key|
|createdAt|`DATETIME`||
|updatedAt|`DATETIME`||
|deletedAt|`DATETIME`||
|title|`VARCHAR(100)`||
|content|`LONGTEXT`||
|categoryId|`INT`||
|authorId|`INT`|Foreign key to `user` table|

* Table name: `decorator`

|Column Name|Data Type|Notes|
|-|-|-|
|id|`INT`|Primary key|
|createdAt|`DATETIME`||
|updatedAt|`DATETIME`||
|deletedAt|`DATETIME`||
|categoryId|`INT`||
|name|`VARCHAR(100)`||
|levelLimit|`INT`||
|content|`LONGTEXT`||
