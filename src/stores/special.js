import { defineStore } from "pinia";
import {ALL_WORDS} from "@/config/words";
import { collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  orderBy,
  limit,
  query, where,  Timestamp } from "firebase/firestore";
import { db } from '@/firebase'
import { useAuthStore } from "@/stores/auth";
export const useSpecialStore = defineStore("special", {
    state: () => ({
        input_value: "",
        index: 0,
        word: "",
        maxlength: 10,
        started: false,
        show_result: false,
        ended: false,
        score: 0,
        defaultTime: 10.00,
        wordTime: 10.00,
        timerCounter: null,
        wordCount: 0,
        level: 1,
        correctLetCount: 0,
        errorLetCount: 0,
        inpLetCount: 0,
        acc: 0,
        listId: [],
        dataByUser: [],
        maxData: [],
        lastData: [],
        lastScore: [],

        tempScore: [],
    }),

    actions: {
         async sortMaxToMin() {
            
            this.maxData.sort(function (a,b) {
                return b.data.score - a.data.score;
            }) 
        },
        async sortMinToMax() {
            this.tempScore.sort((a,b) => {
                return a.createAt - b.createAt;
            })
        },
        async getAllMaxDataByUser() {
            try  { 
            this.maxData = [];
                useAuthStore().allUid.forEach(async (value) => {
                     if (this.maxData.length < 5) {
                        let maxCol = query(collection(db, "specialData"), orderBy("score", "desc"), where("uid", "==", value.uid), limit(1));
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
        async saveLastData() {
            this.lastScore = [];
            this.tempScore.forEach((val) => {
                this.lastScore.push(val.score);
            
            })
 
        },
        async getLastData() {
            try {
                this.tempScore = [];
                const q = query(collection(db, "specialData"), where("uid", "==", useAuthStore().user.uid), orderBy("createAt", "desc"), limit(7))
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((val) => {
                    
                    this.tempScore.push({
                        createAt: val.data().createAt,
                        score: val.data().score,
                    })
                })
            } catch (err) {
                console.log("Error", err);
            }
        },
         async getAllDataByUser() {
            try {
                let specialCol = query(collection(db, "specialData"),where("uid", "==", useAuthStore().user.uid));
                const specialSnapshot = await getDocs(specialCol) 
                specialSnapshot.forEach((doc) => {
                    this.listId.push(doc.id);
                    this.dataByUser.push(doc.data());
                })
            } catch (err) {
                console.log("Err", err);
            }
        
        },
        async saveDataToFireStore() {
            try {
             
                await addDoc(collection(db,'specialData'), {
                    uid: useAuthStore().user.uid,
                    level: this.level,
                    acc: this.acc,
                    score: this.score,
                    stack: this.wordCount,
                     createAt: Timestamp.fromDate(new Date()),
                });
            } catch (err) {
                console.log("Error", err);
            }
        },
         async removeAllData() {
            try {
               if (this.listId.length != 0) {
                this.listId.forEach(async (id) => {
                    await deleteDoc(doc(db,"specialData", id));
                })
               }
            } catch(err) {
                console.log("err",err);
            }
        },
        async timer() {
            this.timerCounter = setInterval(() => {
                this.timeCounter();
            }, 10);
        },
        async timeCounter() {
            var time = this.wordTime;
            if (time > 0.00) {
                time -= 0.01;
                await this.updateTime(time);
                await this.nextLevel();

            } else if (time <= 0) {
                await this.updateTime(0);
                if (this.ended == true ) {
                    this.cancelCountDown();
                    await this.saveDataToFireStore();
                    await this.stopTheGame();
                }
            }

            
        },
        async updateTime(val) {
            this.wordTime = val;
        },
        async cancelCountDown() {
            clearInterval(this.timerCounter);
           
        },

        async stopTheGame() {
            this.started = false;
            this.ended = true;
            this.show_result = true;
        },

        async calacualteAcc() {
            this.acc = Math.floor(((this.correctLetCount - this.errorLetCount) / this.inpLetCount) * 100);
            return this.acc;
        },
        async reset() {
            this.index=  0;
            this.input_value = "";
            this.word = "";
            this.started = false;
            this.ended = false;
            this.show_result = false;
            this.score = 0;
            this.defaultTime = 10.00;
            this.wordTime = 10.00;
            this.level = 1;
            this.correctLetCount = 0;
            this.errorLetCount = 0;
            this.inpLetCount= 0;
            this.acc = 0;
        },
        async newGame() {
            await this.reset();
              await this.giveRemoveClass(document.querySelectorAll(`word`), "", false).then(() => this.cancelCountDown());
            await this.randomWord();
            await this.displayWord();
            await this.activeInput();

            if (document.getElementById("input") != null) {
                document.getElementById("input").disabled = false;
            } else {

            }
        },
        async resetWord() {
            await this.giveRemoveClass();
            await this.randomWord();
            await this.displayWord();
        },
        async activeInput() {
            var inpField = document.getElementById("input");
            document.addEventListener("keydown", () => {
                if (inpField != null) {
                    inpField.focus()
                } else  {}
            });
        },
        async giveRemoveClass() {
            const paragraph = document.getElementById("word-area");
            if (paragraph != null) {
                const children = paragraph.children;
                for (let i = children.length - 1; i >= 0; i--) {
                    paragraph.removeChild(children[i]);

                }
            } else {
               
            }
        },
        async activeWord() {
            var wrd = document.querySelectorAll(`word`);
            wrd.forEach(function (w) {
                w.className = "";
            })

            var active_word = document.querySelector(`word:nth-child(${this.index + 1}`)
            active_word.className = "active"
            var wordLetters = document.querySelectorAll(`word.active span`)
            wordLetters.forEach(function (ltr) {
                ltr.id = ""
                ltr.classList.remove("lineLtr");
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
        async displayWord() {
            var area = document.getElementById("word-area");
            var text = this.word;
            var wordArr = [this.word];
            let i = 0;
            wordArr.forEach(function (wrd) {
              
                  let lastLetter = (text[text.length -1]);
                let lastLetterIndex = text.length-1;
               
                if (wrd === lastLetter && lastLetter === i) {
                    var res_letter = "";
                    var letters = wrd.split("");
                    letters.forEach(function(ltr) {
                        res_word += `<span>${ltr}</span>`;
                       
                    })
                    if (area != null) {
                        area.innerHTML += `<word id="lastWord">${res_word}</word> `
                    } else {

                    }
                    i++;
                }  else {
                     var res_word = ""
                    var letters = wrd.split("")
                     letters.forEach(function(ltr) {
                        res_word += `<span>${ltr}</span>`
                    })
                  if (area != null) {
                       area.innerHTML += `<word>${res_word}</word> `
                  } else {

                  }
                    i++
                }
              
            })
        },
        async checkCorrectWord() {
            if (this.input_value.length  === this.word.length) {
                if (this.input_value == this.word) {
                    this.input_value = "";
                    this.index= 0;
                     if (this.level === 1) {
                        this.wordTime = 10.0
                    } else if (this.level === 2) {
                        this.wordTime = 7.0
                    } else if (this.level === 3) {
                        this.wordTime = 5.0
                    }  else if (this.level === 4) {
                        this.wordTime = 3.0
                    } else if (this.level === 5) {
                        this.wordTime = 2.0
                    }
                    this.wordCount++;
                    this.score += 5*this.word.length;
                    await this.resetWord();
                    this.maxlength = this.word.length;
                } else if (this.input_value != this.word) {
                    // ++ errorword
                    if (this.wordTime <= 0) {
                        this.isGameOver = true;
                    }
                }
            }
        },
        async onChangeInput() {
                var tagWord = document.querySelectorAll(`word:nth-child(${this.index+1}) span`)
                if (this.input_value.length == 0) {
                    tagWord.forEach(function (ltr) {
                        ltr.classList.remove("error");
                        ltr.classList.remove("correct");
                        ltr.classList.remove("lastLetter");
                    })
                } else {
                    this.checkCorrectWord();
                }
        },
        async processInput(event) {
        if (this.ended == true) {

        } else {
            var word_len = this.word.length;
            this.maxlength = word_len;
            this.activeWord();
            this.started = true;
            this.activeInput();
            this.show_result = false;
            this.ended = false;
            var j = 0;
            for (j;j<this.input_value.length;j++) {
                   var letter = document.querySelector(`word:nth-child(${this.index + 1}) span:nth-child(${j + 1})`)
                   if (this.input_value[j] == this.word[j]) {
                    letter.className = "correct";
                    this.score += 5;
                    this.correctLetCount++;
                   } else if (this.input_value[j] != this.word[j]) {
                    letter.className = "error";
                    this.score -= 5;
                    this.errorLetCount++;
                   }
                   this.inpLetCount++;
            }


            if (this.input_value.length == this.word.length) {
                var the_last_letter = document.querySelector("word.active > span:last-child");
                the_last_letter.classList.add("lastLetter");
            }
        }
       },
       
       async processInputSpaceBack(event) {
        if (this.ended == true ) {

        } else {
            var wrd_len = this.word.length;
            this.maxlength = wrd_len;
            this.activeWord();
            this.activeInput();
            if (event.key == " ") {
            } else if (event.key == "Backspace") {
                this.inpLetCount--;
                this.score -= 5;
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
            if (this.input_value.length == wrd_len) {
                var the_last_letter = document.querySelector("word.active > span:last-child")
                    the_last_letter.classList.add("lastLetter")
            } 
        }

       },
        async randomWord() {
            var allword = ALL_WORDS;
            var random = parseInt(Math.random() * allword.length);

            this.word =  allword[random];
            this.maxlength = this.word.length;
        },

        async nextLevel() {
            if (this.score >= 10000) {
                this.level = 5;
            }
            else if (this.score >= 5000) {
                this.level = 4;
            }  else if (this.score >= 2500) {
                this.level = 3;
            } else if (this.score >= 1500) {
                this.level = 2;
            } 
        },
    },
})