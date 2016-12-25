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
  },
  methods: {
    rotateColorBlock() {
      this.rotateDeg += 90;
      console.log(this.getCurrentColor());
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
      this.appBackgroundColor = '';
      this.buttonVisibility = 'hidden';
      this.buttonOpacity = '0';
      this.gameOver = false;
      this.userScores = 0;
      this.objectColor = this.getRandomColor();
      console.log(this.objectColor);
      this.gameIsRunning = true;
      this.gameControl = setInterval(() => {
        this.distanceToTop += this.topPositionIncrement;
      }, 100);
    },
    calculateUserScore() {
      if (this.objectColor === this.colors[this.currentColorIndex]) {
        this.userScores += 1;
        this.checkDifficulty();
        console.log(this.userScores);
      } else {
        this.appBackgroundColor = '#355C7D';
        this.gameOver = true;
        this.gameIsRunning = false;
        clearInterval(this.gameControl);
      }
    },
    checkDifficulty() {

      if (this.userScores >= 10) {
        const fallingSpeed = Math.floor(this.userScores / 10) * 10 + 15;
        this.topPositionIncrement = fallingSpeed;
        console.log(fallingSpeed);
      }
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

