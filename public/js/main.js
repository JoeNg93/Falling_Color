new Vue({
  el: '#app',
  data: {
    rotateValue: '',
    rotateDeg: 45,
    colors: ['#F7DB4F', '#99B898', '#E84A5F', '#5F45AD'],
    objectColor: '',
    currentColorIndex: 0,
    distanceToTop: 0,
    userScores: 0,
    gameIsRunning: false,
    buttonVisibility: 'visible',
    buttonOpacity: '1',
    transitionType: 'top 200ms linear',
    gameOver: false,
    appBackgroundColor: '',
    gameControl: null,
    topPositionIncrement: 20,
    paddingDivHeight: '',
    colorBlockPosition: 0.75 * $(document).height(),

    isSubmitted: false,
    playerName: '',
    messageFromServer: '',
    showSubmitForm: false,
    showLeaderBoard: false,
    topPlayers: [],
  },
  methods: {
    rotateColorBlock() {
      this.rotateDeg += 90;
      this.rotateValue = `rotate(${this.rotateDeg}deg)`;
    },
    getCurrentColor() {
      const currentColor = this.colors[this.currentColorIndex];
      this.currentColorIndex += 1;
      return currentColor;
    },
    getRandomColor() {
      const randomColorIndex = Math.floor(Math.random() * 4);
      return this.colors[randomColorIndex];
    },
    startGame() {
      this.isSubmitted = false;
      this.showSubmitForm = false;
      this.playerName = '';
      this.showLeaderBoard = false;

      this.appBackgroundColor = '';
      this.buttonVisibility = 'hidden';
      this.buttonOpacity = '0';
      this.gameOver = false;
      this.userScores = 0;
      this.objectColor = this.getRandomColor();
      this.gameIsRunning = true;
      this.gameControl = setInterval(() => {
        this.distanceToTop += this.topPositionIncrement;
      }, 100);
    },
    calculateUserScore() {
      if (this.objectColor === this.colors[this.currentColorIndex]) {
        this.userScores += 1;
        this.checkDifficulty();
      } else {
        this.appBackgroundColor = '#355C7D';
        this.gameOver = true;
        this.gameIsRunning = false;
        this.$http.get('/get_leaderboard').then((response) => {
          this.topPlayers = response.body;
          this.showLeaderBoard = true;
          clearInterval(this.gameControl);
        });
      }
    },
    checkDifficulty() {
      if (this.userScores >= 10) {
        const fallingSpeed = Math.floor(this.userScores / 10) * 10 + 15;
        this.topPositionIncrement = fallingSpeed;
      }
    },
    submitPlayerInfo(event) {
      event.preventDefault();
      this.$http.post('/push_score', { name: this.playerName, score: this.userScores })
          .then((response) => {
            this.messageFromServer = response.body;
            this.showSubmitForm = false;
            this.$http.get('/get_leaderboard').then((response) => {
              this.topPlayers = response.body;
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
    },
    showSubmit() {
      this.showSubmitForm = true;
      this.isSubmitted = true;
    }
  },
  watch: {
    // Reset the currentColorIndex when needed
    currentColorIndex() {
      if (this.currentColorIndex > 3) {
        this.currentColorIndex = 0;
      }
    },
    distanceToTop() {
      if (this.distanceToTop >= this.colorBlockPosition) {
        this.calculateUserScore();
        this.objectColor = this.getRandomColor();
        this.distanceToTop = 0;
      }
    }
  },
});

