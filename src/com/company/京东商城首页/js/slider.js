/*轮播图*/
class Slider {
    constructor(id) {
        this.box = document.querySelector(id);
        this.picBox = this.box.querySelector("ul");
        this.indexBox = this.box.querySelector(".index-box");
        this.index = 1;
        this.sliderWidth = this.box.clientWidth; /*整个容器的宽度*/
        /*防止多次连续点击之后出现轮播图显示错乱,该标记表示当前是否处在移动的过程中*/
        this.animated = false;
        /*轮播图数量*/
        this.sliders = this.picBox.children.length;
        this.auto = null;
        this.init();
    }

    init() {
        console.log("slider");
        this.initPoint();
        this.copyPic();
        this.leftRight();
        this.play();
    }

    /*生成小圆点*/
    initPoint() {
        /*小圆点的数量*/
        const num = this.picBox.children.length;
        /*生成一个片段*/
        let frg = document.createDocumentFragment();
        for(let i = 0;i < num;i++) {
            /*生成li*/
            let li = document.createElement("li");
            /*添加li属性*/
            li.setAttribute("data-index",i+1);
            if(i === 0) {
                li.className = "active";
            }
            frg.appendChild(li);
        }
        /*让小圆点之间有间距*/
        this.indexBox.children[0].style.width = num*10*2+"px";
        /*把处理好的片段加在页面上*/
        this.indexBox.children[0].appendChild(frg);

        /*添加小圆点的功能，可以点击*/
        this.indexBox.children[0].addEventListener("click",(e) => {
            console.log("point");
            let pointIndex = (e.target).getAttribute("data-index");
            let offset = (pointIndex - this.index) * this.sliderWidth;
            this.index = pointIndex;
            this.move(offset);
            console.log(this.index);
        });
    }

    /* 辅助图方案 让轮播图切换更顺滑
    *  5 【1 2 3 4 5】 1
    *  在队列头和尾添加尾、头的复制图片
    *  需要狸猫换太子的切换，头、尾的复制其实就是缓冲
    * */
    copyPic() {
        /*复制了1号页面*/
        const first = this.picBox.firstElementChild.cloneNode(true);
        /*复制了最后一个页面*/
        const last = this.picBox.lastElementChild.cloneNode(true);
        /*队列后面添加1号*/
        this.picBox.appendChild(first);
        /*队列前面添加最后号*/
        this.picBox.insertBefore(last,this.picBox.firstElementChild);

        /*
        * 这个地方设置为负数，是因为，使用辅助图方案之后，把最后一张的clone放在了队列前面
        * 不做处理的话，会第一张显示这个最后一张的clone
        * */
        this.picBox.style.width = this.sliderWidth * this.picBox.children.length+"px";
        this.picBox.style.left = -1 * this.sliderWidth +"px";
    }

    /*轮播图的左右切换*/
    leftRight() {
        this.box.querySelector(".left-box").addEventListener("click",() => {
            console.log("left");
            if(this.animated) {
                return;
            }
            /*防止溢出*/
            if(this.index - 1 < 1) {
                /*进行重置*/
                this.index = this.sliders;
            }else  {
                this.index--;
            }
            this.move(-this.sliderWidth);
        });
        this.box.querySelector(".right-box").addEventListener("click",() => {
            console.log("right");
            if(this.animated) {
                return;
            }
            /*防止溢出*/
            if(this.index + 1 > this.sliders) {
                /*进行重置*/
                this.index = 1;
            }else  {
                this.index++;
            }
            this.move(this.sliderWidth);
        });
    }

    /* 改变图片位置，达到切换图片的目的
    *  offset表示移动的位移
    *  左负右正
    * */
    move(offset) {
        this.animate(offset);
        /*得到有多少个小点*/
        const num = this.indexBox.children[0].children.length;
        for (let i = 0; i < num; i++) {
            /*清除亮度*/
            this.indexBox.children[0].children[i].className = "";
        }
        /*点亮当前索引的小圆点*/
        this.indexBox.children[0].children[this.index-1].className = "active";
    }


    /*一点一点的移动*/
    animate(offset) {
        /*切换图片的时间*/
        const time = 1000;
        /*每次运动的时间*/
        const rate = 100;
        /*速度*/
        let speed = offset/(time/rate);
        /*本次移动的目标距离*/
        let goal = parseFloat(this.picBox.style.left)-offset;

        this.animated = true;

        /*动起来代码*/
        let animate = setInterval(() => {
            if(this.picBox.style.left === goal || Math.abs(Math.abs(parseFloat(this.picBox.style.left))-Math.abs(goal)) < Math.abs(speed)) {
                this.picBox.style.left = goal+"px";
                clearInterval(animate);
                this.animated = false;
                /*判断是否到队列头、尾了，需要狸猫换太子了*/
                if(parseFloat(this.picBox.style.left) === 0) {
                    this.picBox.style.left = -this.sliders * this.sliderWidth+"px";
                }else if(parseFloat(this.picBox.style.left) === -(this.sliders+1)*this.sliderWidth) {
                    this.picBox.style.left = -this.sliderWidth+"px";
                }
            }else {
                this.picBox.style.left = parseFloat(this.picBox.style.left)-speed+"px";
            }
        },rate);
    }

    /*播放*/
    play() {
        /*触发自动播放*/
        this.auto = setInterval(() => {
            this.box.querySelector(".right-box").click();
        },1000);
        /*鼠标放上面的时候暂停自动播放*/
        this.box.addEventListener("mouseenter",() => {
            clearInterval(this.auto);
        });
        this.box.addEventListener("mouseleave",() => {
            this.auto = setInterval(() => {
                this.box.querySelector(".right-box").click()
            },1000);
        });
    }
}