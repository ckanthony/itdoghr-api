<img width="100px" src="https://upload.cc/i1/2022/01/31/s2JY6c.png" />

【ViuTV】《IT狗》HR 啊姐的電腦 (backend) [itdoghr.com](https://itdoghr.com)
===============

<img src="https://upload.cc/i1/2022/01/31/Bzg4Dv.png" />

參考IT 狗劇情，這是一個模擬HR 啊姐的電腦的作品。內裡隨了有HR 啊姐的工作檔案，當然不少得<<員工綜合能力管理系統>>。  誰是最有價值員工？  由你定奪!

IT 狗是難得少見貼地的香港創科劇，在IT 人角色上的描述不再以一向大台的刻板印象為主，令人耳目一新。可以想像要能拍出如此質素，需要準備的工夫是不少，是十分有熱誠和對行業專重。我們受到這套劇的誠意打動，希望令更多人知道這套劇的存在。阿信曾說過他沒想過要改變世界，他只想踏出小小的一步，改變明天。這個小作品就是我們對這套劇的回應。<br /><br />
目標:<br />
<ul>
	<li>
		希望可以令更多人知道和欣賞《IT狗》
	</li>
	<li>
		希望可以令更多人知道和欣賞劇中演員和幕後人員
	</li>
	<li>
		實踐劇中的技術, 使其可以在日常使用
	</li>
	<li>
		盡可能簡單化，令開發速度可加快
	</li>
	<li>
		開放源碼令更多香港IT 人加入共商善舉
	</li>
	<li>
		影響更多香港人對IT 的興趣，為行業帶來正面影響
	</li>
</ul>

由於開發時間短促，儘管我們已盡力校對，資料可能還會出錯或缺失。歡迎<a href="https://www.instagram.com/itdoghr/" target="_blank">指正</a>或<a href="https://github.com/ckanthony/itdoghr-app" target="_blank">直接參與開發</a>

frontend 請見[連結](https://github.com/ckanthony/itdoghr-app)
www 請見[連結](https://github.com/ckanthony/itdoghr-www)

員工綜合能力管理系統 - 即時投票實現方法
---------------------------------------------

- this is a system using server client model, connecting with `socket.io` with `express.js` by using a hybrid of RESTful and websocket communication
- in order to store data fast and effectively, the database we use is `redis` with data persistency settings, we have also make use of in memory cache for max performance
- for each vote request, we shoot it into a message queue `bulljs` and its being processed by a processor process, which is the only point to write messages into the redis database, to avoid race conditions
- the server can be scaled up horizontally in case of big traffic with a load balancer setup


local installation
--------------------------------
1. setup `.env`
2. run redis `sudo docker run --name redis -p6379:6379 -d --restart=always redis:6-alpine`
3. run `node processor.js`
4. run `node server.js`


開發者
-----
<a href="https://github.com/ckanthony/name-easy-api/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ckanthony/itdoghr-api" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

免責聲名
-------
本作品內的資料，圖像，皆參考自香港電視娛樂(下稱ViuTV) 製作之喜劇電視劇 原創劇《IT狗》（英語：In Geek We Trust）中的劇情，版權全部屬於ViuTV，我都冇say，版權擁有者可以決定其他人是否有權使用他們的作品。  本作品所提供的資料只供參考之用。

本作品在制作的途中參考了圖形使用者介面GUI 介面，用以模擬用家在電腦系統中的操作，並沒有任何企圖或意途令任何軟體公司在財務或聲譽上受損，本作品為非盈利的。

如有需要請以 <ckanthony[at]gmail.com> 和anthony (backend) <jeremytsngtsng[at]gmail.com> Jeremy (frontend) 聯絡。


