import { defineStore } from "pinia";
import { wordList } from "@/config/words";
import { useAuthStore } from "@/stores/auth";
import { collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  orderBy,
  limit,
  query, where, Timestamp } from "firebase/firestore";
import { db } from '@/firebase'
export const useGameStore = defineStore('game', {

    state: () => ({
        show_keyboard: true,
        timeSet: [15, 30, 60, 120],
        wordSet: [10, 25, 50, 100],
        isTimeMode: true,
        isWordMode: false,
        started: false,
        ended: false,
        activeLock: false,
        show_result: false,
        curTime: 30,
        time_count: 30,
        word_count: 25,
        curCount: 25,
        acc: 0,
        wpm: 0,
        input_value: "",
        maxLengthInput: 10,
        index: 0,
        text_list: [],
        currentWord: "",
        errorWordList: [],
        errorWordCount: 0,
        errorLetterList: [],
        errorLetterCount: 0,
        correctWordList: [],
        correctWordCount: 0,
        correctLetterList: [],
        correctLetterCount: 0,
        inputWordList: [],
        inputWordCount: 0,
        inputLetterList: [],
        inputLetterCount: 0,
        testRecord: [],
        timerCounter: null,
        wps: [],
        testWPS: [],
        testACC: [],
        testTime: [],
        dataByUser: [],
        maxData: [],
        sortData: [],
        listId: [],
        lastData: [],
        lastWpm: [],
        lastACC: [],
        tempAcc: [],
        tempWpm: [],
    }),

    getters: {
        getChartData() {
            return {
                labels: this.testTime,
                datasets: [{
                    data: this.testACC,
                }]
            }
        },

     
    },

    actions: {
        async sortMaxToMin() {
            
            this.maxData.sort(function (a,b) {
                return b.data.wpm - a.data.wpm;
            }) 
        },
         async sortMinToMax() {
            this.tempWpm.sort((a,b) => {
                return a.createAt - b.createAt;
            })

            this.tempAcc.sort((a,b) => {
                return a.createAt - b.createAt;
            })
        },
        async saveLastData() {
            this.lastACC = [];
            this.lastWpm = [];
            this.tempAcc.forEach((val) => {
                this.lastACC.push(val.data);
            
            })
            this.tempWpm.forEach((val) => {
                this.lastWpm.push(val.data);
            })
 
        },
         async getLastData() {
            try {
                this.tempWpm = [];
                this.tempAcc = [];
                const q = query(collection(db, "normalData"), where("uid", "==", useAuthStore().user.uid), orderBy("createAt", "desc"), limit(7))
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((val) => {
                   this.tempWpm.push({
                    data: val.data().wpm,
                    createAt: val.data().createAt,
                   });
                   this.tempAcc.push({
                    data: val.data().acc,
                    createAt: val.data().createAt,
                   }); })
            } catch (err) {
                console.log("Error", err);
            }
        },
        async getAllMaxDataByUser() {
            try  {
              
            this.maxData = [];
                useAuthStore().allUid.forEach(async (value) => {
                     if (this.maxData.length < 5) {
                        let maxCol = query(collection(db, "normalData"), orderBy("wpm", "desc"), where("uid", "==", value.uid), limit(1));
                     const maxSnapshot = await getDocs(maxCol);
                    maxSnapshot.forEach((val) => {
                     
                            this.maxData.push({
                            username: value.name,
                            data: val.data(),
                        });
                   
                    })
                     } 
                     
                   
                })
             
            } catch (err) {
                console.log("Error", err);
            }
        },
        async getAllDataByUser() {
            try {
                let normalCol = query(collection(db, "normalData"),where("uid", "==", useAuthStore().user.uid));
                const normalSnapshot = await getDocs(normalCol) 
                normalSnapshot.forEach((doc) => {
                    this.listId.push(doc.id);
                    this.dataByUser.push(doc.data());
                })
            } catch (err) {
                console.log("Err", err);
            }
        
        },
        async saveDataToFireStore() {
            try { 
                await addDoc(collection(db,'normalData'), {
                    uid: useAuthStore().user.uid,
                    wpm: this.wpm,
                    acc: this.acc,
                    timeList: this.testTime,
                    wpmList: this.testWPS,
                    accList:  this.testACC,
                    errorLetterList: this.errorLetterList,
                    errorWordList: this.errorWordList,
                    createAt: Timestamp.fromDate(new Date()),
                });
            } catch (err) {
                console.log("error", err);
            } 
        },
        async removeAllData() {
            try {
               if (this.listId.length != 0) {
                this.listId.forEach(async (id) => {
                    await deleteDoc(doc(db,"normalData", id));
                })
               }
            } catch(err) {
                console.log("err",err);
            }
        },
        async timer() {
            this.timerCounter = setInterval(this.timeCounter, 1000);
        },
        async timeCounter() {

           if (this.isTimeMode == true) {
            
            let position = document.querySelector("word.active");
            position.scrollIntoView({
                behavior: "smooth"
            })
            let timeTemp = this.curTime;
            timeTemp--;
            this.updateTime(timeTemp);
            this.addValueToChart({"correctWordCount": this.correctWordCount, "time": this.time_count - this.curTime, "acc": Math.floor(((this.correctLetterCount - this.errorLetterCount) / this.inputLetterCount) * 100 )});
            if (this.curTime === 0) {
                clearInterval(this.timerCounter);
                this.stopTheGame();
            }
           } else if (this.isWordMode == true) {
             let position = document.querySelector("word.active");
            position.scrollIntoView({
                behavior: "smooth"
            })
            let timeTemp = this.curTime;
            timeTemp++;
            this.updateTime(timeTemp);
             this.addValueToChart({"correctWordCount": this.correctWordCount, "time": this.curTime, "acc": Math.floor(((this.correctLetterCount - this.errorLetterCount) / this.inputLetterCount) * 100 )});
            if (this.ended == true) {
                clearInterval(this.timerCounter);
                this.stopTheGame();
            }
           }
        },
        async resetGame() {
            this.started = false;
            this.ended = false;
            this.show_result = false;
            this.curTime = this.time_count;
            this.curCount = this.word_count;
            this.acc = 0;
            this.wpm = 0;
            this.points = 0;
            this.input_value = "";
            this.maxLengthInput = 10;
            this.index = 0;
            this.text_list = [];
            this.currentWord = "";
            this.errorWordList = [];
            this.errorWordCount = 0;
            this.errorLetterList = [];
            this.errorLetterCount = 0;
            this.correctWordList = [];
            this.correctWordCount = 0;
            this.correctLetterList = [];
            this.correctLetterCount = 0;
            this.inputWordList = [];
            this.inputWordCount = 0;
            this.inputLetterList = [];
            this.inputLetterCount = 0;
            this.testRecord = [];
            this.wps = [];
            this.testWPS = [];
        this.testACC =[];
        this.testTime = [];
            await this.played();
        },

        async played() {
            await this.giveRemoveClass();
            await this.resetPosition();
            await this.randomFunction();
            await this.displayText();
            await this.activeInput();
            clearInterval(this.timerCounter);
            var lastWordLength =
                this.text_list[this.text_list.length - 1].length;
            setInterval(function() {
                var lastWord = document.getElementById("lastWord");
                var activeWord = document.querySelector(".active");
                if (lastWord === activeWord) {
                    if (lastWord != null) {
                        if (lastWord.length == this.input_value) {
                            this.ended = true;
                        }
                    }
                }
            }, 200);
        },
        async resetPosition() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        async giveRemoveClass() {
            const paragraph = document.getElementById("paragraph-area");
            if (paragraph != null) {
                const children = paragraph.children;
                for (let i = children.length - 1; i >= 0; i--) {
                    paragraph.removeChild(children[i]);

                }
            } else {
              
            }
        },

        async calculateCharts() {
            if (this.isTimeMode == true) {
               
                if (this.testRecord.length >= 120) {
let j=  0;
                    for (j;j < this.testRecord.length;j++) {
                   
                         if (this.testRecord[j].time % 12 == 0) {
                             this.testWPS.push(this.wps[j]);
                          this.testACC.push(this.testRecord[j].acc);
                          this.testTime.push(this.testRecord[j].time); 
                         }
                    }
                } else if (this.testRecord.length >= 60) {
                    let j=  0;
                    for (j;j < this.testRecord.length;j++) {
                      
                         if (this.testRecord[j].time % 6 == 0) {
                             this.testWPS.push(this.wps[j]);
                          this.testACC.push(this.testRecord[j].acc);
                          this.testTime.push(this.testRecord[j].time); 
                         }
                    }
                } else if (this.testRecord.length >= 30) {
                    let j=  0;
                    for (j;j < this.testRecord.length;j++) {
                         if (this.testRecord[j].time % 2 == 0) {
                             this.testWPS.push(this.wps[j]);
                          this.testACC.push(this.testRecord[j].acc);
                          this.testTime.push(this.testRecord[j].time); 
                         }
                    }
                } else if (this.testRecord.length >= 15 || this.testRecord.length <= 15) {
                    let j=  0;
                    for (j;j < this.testRecord.length;j++) {
                          this.testWPS.push(this.wps[j]);
                          this.testACC.push(this.testRecord[j].acc);
                          this.testTime.push(this.testRecord[j].time); 
                    }
                }
             } else if (this.isWordMode == true) {

                if (this.testRecord.length >= 120) {
let j=  0;
                    for (j;j < this.testRecord.length;j++) {
                      
                         if (this.testRecord[j].time % 12 == 0) {
                             this.testWPS.push(this.wps[j]);
                          this.testACC.push(this.testRecord[j].acc);
                          this.testTime.push(this.testRecord[j].time); 
                         }
                    }
                } else if (this.testRecord.length >= 60) {
                    let j=  0;
                    for (j;j < this.testRecord.length;j++) {
                     
                         if (this.testRecord[j].time % 6 == 0) {
                             this.testWPS.push(this.wps[j]);
                          this.testACC.push(this.testRecord[j].acc);
                          this.testTime.push(this.testRecord[j].time); 
                         }
                    }
                } else if (this.testRecord.length >= 30) {
                    let j=  0;
                    for (j;j < this.testRecord.length;j++) {
                     
                         if (this.testRecord[j].time % 2 == 0) {
                             this.testWPS.push(this.wps[j]);
                          this.testACC.push(this.testRecord[j].acc);
                          this.testTime.push(this.testRecord[j].time); 
                         }
                    }
                } else if (this.testRecord.length >= 15 || this.testRecord.length <= 15) {
                    let j=  0;
                    for (j;j < this.testRecord.length;j++) {
                          this.testWPS.push(this.wps[j]);
                          this.testACC.push(this.testRecord[j].acc);
                          this.testTime.push(this.testRecord[j].time); 
                    }
                }
            }

         
            this.show_result = true;
        },
        async calculateAcc() {
            this.acc = Math.floor(((this.correctLetterCount - this.errorLetterCount) / this.inputLetterCount) * 100);
            return this.acc;
        },
        async calculateWPM() {
            if (this.isTimeMode == true) {
                var time = this.time_count / 60;
            this.wpm = (this.correctWordCount / time);
            } else if (this.isWordMode == true) {

                var time = this.curTime / 60;
            
                this.wpm = (this.correctWordCount / time);
            }
            return this.wpm;
        },

        async calculateWPS() {
            let i = 0;
            for (i;i<this.testRecord.length;i++) {
                var tempWps = ( (this.testRecord[i].correctWordCount / this.testRecord[i].time) * 60).toFixed(2);
                this.wps.push(tempWps);
            }

        },
        async selectTimeMode() {
            this.isTimeMode = true;
            this.isWordMode = false;
            this.time_count = 30;
            await this.resetGame();
            

        },

        async selectWordMode() {
            this.isTimeMode = false;
            this.isWordMode = true;
            this.curTime = 0;
            this.time_count = 0;
            this.word_count = 25;
            await this.resetGame();
        },

        async setTime(time) {
            var t = parseInt(time);
            this.time_count = t;
            this.curTime = t;
            await this.resetGame();
            
        },

        async setWord(word) {
            var w = parseInt(word);
             this.curTime = 0;
            this.time_count = 0;
            this.word_count = w;
            this.curCount = w;
             await this.resetGame();
        },
        async activeInput() {
            var inpField = document.getElementById("inputField");
            document.addEventListener("keydown", () => {
                if (inpField != null) {
                    inpField.focus()
                } else {
                    
                }
            });
        },
        async activeWord() {
            var allWord = document.querySelectorAll(`word`)
            allWord.forEach(function(wrd) {
                wrd.className = ""
            })

            var active_word = document.querySelector(`word:nth-child(${this.index + 1}`)
            active_word.className = "active"
            var wordLetters = document.querySelectorAll(`word.active span`)
            wordLetters.forEach(function(ltr) {
                ltr.id = ""
                ltr.classList.remove("lineLtr")
            })

            try {
                var activeLetter = document.querySelector(`word.active > span:nth-child(${this.input_value.length})`)
                activeLetter.id = "activeLetter"

                var lineLetter = document.querySelector(`word.active > span:nth-child(${this.input_value.length+1})`)
                lineLetter.classList.add("lineLtr")
            } catch {
                var activeLetter = document.querySelector(`word.active > span:nth-child(1)`)
                activeLetter.id = "activeLetter"
            }
        },
        async displayText() {
            var area = document.getElementById("paragraph-area");
            var textArr = this.text_list;
            let i = 0;
            this.text_list.forEach(function(word) {
                let lastWord = (textArr[textArr.length - 1])
                let lastWordIndex = textArr.length - 1
                if (word === lastWord && lastWordIndex === i) {
                    var res_word = "";
                    var letters = word.split("")
                    letters.forEach(function(ltr) {
                        res_word += `<span>${ltr}</span>`;
                    })

                   if (area != null) {
                     area.innerHTML += `<word id="lastWord">${res_word}</word> `
                   } else {
                    
                   }
                   
                    i++;
                } else {
                    var res_word = ""
                    var letters = word.split("")
                    letters.forEach(function(ltr) {
                        res_word += `<span>${ltr}</span>`
                    })

                   
                    if (area != null) {
                        area.innerHTML += `<word>${res_word}</word> `;
                    } else {

                    }
                    i++
                }
            })
        },
        async checkCorrectWord(index, word) {
            
            var i = 0
            var tagWord = document.querySelectorAll(`word:nth-child(${index}) span`)
            for (i; i < tagWord.lenth; i++) {
                var ltr = tagWord[i]
                var ltr_className = ltr.className
                if (ltr_className == "correct" || ltr_className == "correct lastLetter") {

                } else {
                    ltr.className = "error"
                }
            }
            var correctLetters = document.querySelectorAll("word.active span.correct").length
            var the_word = document.querySelectorAll("word.active span")
            if (correctLetters == the_word.length) {
                this.correctWordCount++;
                this.curCount --;
            } else {
                this.errorWordCount++;
                this.curCount --;
            }
            var text = "";
            the_word.forEach(function (wrd) {
text += wrd.innerHTML;
            })
            this.inputWordList.push(text);
        },
        async onChangeInput() {
            var tagWord = document.querySelectorAll(`word:nth-child(${this.index+1}) span`)
            if (this.input_value.length == 0) {
                tagWord.forEach(function(ltr) {
                    ltr.classList.remove("error");
                    ltr.classList.remove("correct");
                    ltr.classList.remove("lastLetter");
                })
            }

            if (this.isWordMode == true) {
                if (this.curCount == 0) {
                   this.ended = true;
                    this.started = false;
                }
            }
        },

        async processInput(event) {
            
            if (this.ended == true) {
                this.started = false;
            } else {
                var word = this.text_list[this.index]
                var word_length = word.length
                this.maxLengthInput = word_length;
                this.activeWord();
                this.started = true;
                this.activeInput();
                this.ended = false;
                var j = 0;
                for (j; j < this.input_value.length; j++) {
                    var letter = document.querySelector(`word:nth-child(${this.index + 1}) span:nth-child(${j + 1})`)
                    if (this.input_value[j] == word[j]) {
                        letter.className = "correct"
                        this.correctLetterCount++
                    } else if (this.input_value[j] != word[j]) {
                        letter.className = "error"
                        this.errorLetterCount++;
                        this.errorLetterList.push(word[j]);
                    }
                    this.inputLetterCount++
                        this.inputLetterList.push(this.input_value[j]);
                }
                if (this.input_value.length == word_length) {
                    var the_last_letter = document.querySelector("word.active > span:last-child")
                    the_last_letter.classList.add("lastLetter")
                }
            }
        },

        async processInputSpaceBack(event) {
            if (this.end_game == true) {

            } else {
                var word = this.text_list[this.index];
                var word_length = word.length
                this.maxLengthInput = word_length;
                this.activeWord()
                this.activeInput()
                if (event.key == " ") {
                    var activeLetter = document.querySelector(`word.active > span:nth-child(${this.input_value.length})`)
                    activeLetter.classList.remove("activeLetter")
                    this.checkCorrectWord(this.index + 1, this.input_value)
                    var the_last_letter = document.querySelector("word.active > span:last-child")
                    the_last_letter.classList.remove("lastLetter")
                    var wordLetters = document.querySelectorAll(`word.active span`)
                    wordLetters.forEach(function(ltr) {
                        ltr.id = ""
                    })
                    if (this.text_list.length == this.inputWordList.length) {
                        this.ended = true
                    } else {
                        try {
                        var activeLetter = document.querySelector(`word:nth-child(${this.index+2}) > span:first-child`)
                        activeLetter.id = "activeLetter"
                        this.input_value = ""
                        this.index++
                            this.correct_key_num = 0
                        var lineLetter = document.querySelector(`word:nth-child(${this.index +1 }) > span:nth-child(1)`)
                        lineLetter.classList.add("lineLtr")
                    } catch (e) {
                        this.end_game = true
                
                    
                        this.resetGame();

                    }
                    }
                } else if (event.key == "Backspace") {
                    this.inputLetterCount--
                        if (this.input_value.length == 0) {
                            var lineLetter = document.querySelector(`word.active > span:nth-child(1)`)
                            lineLetter.className = ""
                            lineLetter.classList.add("lineLtr")
                        } else {
                            if (this.maxLengthInput == 1) {
                                var lineLetter = document.querySelector(`word.active > span:nth-child(1)`)
                                var letter = document.querySelector(`word.active > span:nth-child(1)`)
                                letter.className = ""
                                lineLetter.classList.add("lineLtr")
                            } else {
                                var lineLetter = document.querySelector(`word.active > span:nth-child(${this.input_value.length+1})`)
                                var letter = document.querySelector(`word.active > span:nth-child(${this.input_value.length+1})`)
                                letter.className = ""

                                lineLetter.classList.add("lineLtr")
                            }
                        }
                }
                if (this.input_value.length == word_length) {
                    var the_last_letter = document.querySelector("word.active > span:last-child")
                    the_last_letter.classList.add("lastLetter")
                }
            }

        },
        async updateCount(val) {
            return this.curCount = val;
        },
        async updateTime(val) {
            return this.curTime = val;
        },



        async randomFunction() {
            var i = 0;
            if (this.isWordMode == true) {
                while (this.text_list.length != this.word_count) {
                    let randomWord = parseInt(Math.random() * wordList.length);
                    let random = wordList[randomWord];
                    this.text_list.push(random);
                }

            } else {
                while (i != 100) {
                    let randomWord = parseInt(Math.random() * wordList.length);
                    let random = wordList[randomWord];
                    this.text_list.push(random);
                    i++;
                }
            }
            this.currentWord = this.text_list.join(" ");

        },


        async stopTheGame() {
            this.started = false;
            this.ended = true;
        },

        async addValueToChart(val) {
            this.testRecord.push(val);
        },

        async checkCapLock(event) {
            if (event.getModifierState("CapLock")) {
                this.activeLcok = true;
            } else {
                this.activeLock = false;
            }

        },
        async endTypingTest() {
            var lastWordindex = this.text_list.length;
        }
    },
})