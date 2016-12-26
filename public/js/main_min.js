new Vue({el:'#app',data:{rotateValue:'',rotateDeg:45,colors:['#F7DB4F','#99B898','#E84A5F','#5F45AD'],objectColor:'',currentColorIndex:0,distanceToTop:0,userScores:0,gameIsRunning:!1,buttonVisibility:'visible',buttonOpacity:'1',transitionType:'top 200ms linear',gameOver:!1,appBackgroundColor:'',gameControl:null,topPositionIncrement:20,paddingDivHeight:'',colorBlockPosition:0.75*$(document).height(),isSubmitted:!1,playerName:'',messageFromServer:'',showSubmitForm:!1,showLeaderBoard:!1,topPlayers:[],},methods:{rotateColorBlock(){this.rotateDeg+=90;this.rotateValue=`rotate(${this.rotateDeg}deg)`},getCurrentColor(){const currentColor=this.colors[this.currentColorIndex];this.currentColorIndex+=1;return currentColor},getRandomColor(){const randomColorIndex=Math.floor(Math.random()*4);return this.colors[randomColorIndex]},startGame(){this.isSubmitted=!1;this.showSubmitForm=!1;this.playerName='';this.showLeaderBoard=!1;this.appBackgroundColor='';this.buttonVisibility='hidden';this.buttonOpacity='0';this.gameOver=!1;this.userScores=0;this.objectColor=this.getRandomColor();this.gameIsRunning=!0;this.gameControl=setInterval(()=>{this.distanceToTop+=this.topPositionIncrement},100)},calculateUserScore(){if(this.objectColor===this.colors[this.currentColorIndex]){this.userScores+=1;this.checkDifficulty()}else{this.appBackgroundColor='#355C7D';this.gameOver=!0;this.gameIsRunning=!1;this.$http.get('/get_leaderboard').then((response)=>{this.topPlayers=response.body;this.showLeaderBoard=!0;clearInterval(this.gameControl)})}},checkDifficulty(){if(this.userScores>=10){const fallingSpeed=Math.floor(this.userScores/10)*10+15;this.topPositionIncrement=fallingSpeed}},submitPlayerInfo(event){event.preventDefault();this.$http.post('/push_score',{name:this.playerName,score:this.userScores}).then((response)=>{this.messageFromServer=response.body;this.showSubmitForm=!1;this.$http.get('/get_leaderboard').then((response)=>{this.topPlayers=response.body})}).catch((err)=>{console.log(err.message)})},showSubmit(){this.showSubmitForm=!0;this.isSubmitted=!0}},watch:{currentColorIndex(){if(this.currentColorIndex>3){this.currentColorIndex=0}},distanceToTop(){if(this.distanceToTop>=this.colorBlockPosition){this.calculateUserScore();this.objectColor=this.getRandomColor();this.distanceToTop=0}}},})