# Neochess
### The minimalistic chess server

I challenged myself to code a chess server in one week and neochess is the result. The core was written in a week, but some improvements are still being added. Neochess focuses on what really matters, the game itself. There are no accounts and usernames are auto-generated. Only players can access the game, but adding the possibility of watching games is something I'm planning to do in the future.
Check out a preview of [Neochess](https://davidborges.xyz/neochess) running at my website. There may be bugs in the current implementation. If you find some, you can let me know by opening an issue on this repository. I'll try to solve them as soon as I'm available.

The website was built using [Vue.js](https://vuejs.org/), along with other free software tools. The server runs on [Node.js](https://nodejs.org/en/) and game data is stored at [MongoDB Cloud](https://www.mongodb.com/cloud). Real time synchronization between players is done with [Socket.IO](https://socket.io/).

The board is a fork from [vue-chessboard](https://github.com/vitogit/vue-chessboard), which is a wrapper for [Chessground](https://github.com/ornicar/chessground) and [chess.js](https://github.com/jhlywa/chess.js). You can see the fork and its modifications [here](https://github.com/cosmonautd/vue-chessboard).

<img src="https://davidborges.xyz/assets/neochess1.jpg" alt="Landing Page" width="300"/> <img src="https://davidborges.xyz/assets/neochess2.jpg" alt="Start or Join a Game" width="300"/>

<img src="https://davidborges.xyz/assets/neochess3.jpg" alt="Game Started" width="300"/> <img src="https://davidborges.xyz/assets/neochess4.jpg" alt="Ruy Lopez is on the Board" width="300"/>

## Installation
#### Step 1: Clone
Clone this repository

```git clone https://github.com/cosmonautd/Neochess.git```

#### Step 2: Set up the server
Go to neochess-server, install the dependencies and start.

```
npm install
npm start
```

#### Step 3: Set up the website
Go to neochess-web, clone the forked board, install the dependencies and start.

```
git clone https://github.com/cosmonautd/vue-chessboard.git src/components
npm install
npm run serve
```

#### Step 4: Play
Access http://localhost:8080 and voilà.


