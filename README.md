<img src="https://i.imgur.com/um3TOZc.png" />

【ViuTV】《IT狗》HR 啊姐的電腦 (backend) [itdoghr.com](https://itdoghr.com)
===============

<img src="https://i.imgur.com/2xvORiI.jpg" />

參考IT 狗劇情，這是一個模擬HR 啊姐的電腦的作品。內裡隨了有HR 啊姐的工作檔案，當然不少得<<員工綜合能力管理系統>>。  誰是最有價值員工？  由你定奪!

frontend 請見[連結](https://github.com/ckanthony/it-dog-voting)

員工綜合能力管理系統 - 即時投票實現方法
---------------------------------------------

- this is a system using server client model, connecting with `socket.io` with `express.js` by using a hybrid of RESTful and websocket communication
- in order to store data fast and effectively, the database we use is `redis` with data persistency settings, we have also make use of in memory cache for max performance
- for each vote request, we shoot it into a message queue `bulljs` and its being processed by a processor process, which is the only point to write messages into the redis database, to avoid race conditions
- the server can be scaled up vertically in case of big traffic with a load balancer setup


local installation
--------------------------------
1. setup `.env`
2. run redis `sudo docker run --name redis -p6379:6379 -d --restart=always redis:6-alpine`
3. run `node processor.js`
4. run `node server.js`


開發者
-----
<a href="https://github.com/ckanthony/name-easy-api/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ckanthony/name-easy-api" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

免責聲名
-------
本作品內的資料，圖像，皆參考自香港電視娛樂(下稱ViuTV) 製作之喜劇電視劇 原創劇《IT狗》（英語：In Geek We Trust）中的劇情，版權全部屬於ViuTV，我都冇say，版權擁有者可以決定其他人是否有權使用他們的作品。  本作品所提供的資料只供參考之用。

本作品在制作的途中參考了圖形使用者介面GUI 介面，用以模擬用家在電腦系統中的操作，並沒有任何企圖或意途令任何軟體公司在財務或聲譽上受損，本作品為非盈利的。

為了保護知識產權，本作品不會使用受知識產權所保護的徽標、圖形、聲音或圖像。

如有需要請以 <ckanthony[at]gmail.com> 和anthony (backend) <jeremytsngtsng[at]gmail.com> Jeremy (frontend) 聯絡。


