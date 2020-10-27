/* 从一级表单到二级表单用来增加用户体验，鼠标可以直接从一级表单直接到二级表单的项
*  而不需要先向右、再向下，否则会触发其他的一级表单下的二级表单(切换过快)
* */
/*分类处理类*/
class Menu {
    /*构造函数，传进来的id就是要处理的盒子id*/
    constructor(id) {
        this.box = document.querySelector(id);
        this.ul = this.box.querySelector("ul");
        this.lis = this.box.querySelectorAll("li");
        this.subMenuEles = this.box.querySelectorAll(".sub-menu");
        this.timer1 = null;  /*第一个定时器*/
        this.timer2 = null;
        this.init();
    }

    /*初始化，使用定时器控制是否切换一级菜单*/
    init() {
        console.log("menu");
        /*鼠标移动到一级菜单项事件 e代表事件*/
        this.lis.forEach((item) => {
            item.addEventListener("mouseenter",(e)=> {
                let li = e.target;
                /*在浏览器的console模块可以看到日志*/
                console.log("鼠标移动到事件");
                if(this.timer1 != null) {
                    /*定时器正在跑的时候，清除定时器,也就是只显示最后一次触发的二级菜单，中间划过的不用管，防抖*/
                    clearTimeout(this.timer1);
                }
                /*200ms再去作里面的事*/
                this.timer1 = setTimeout(()=>{
                    this.subMenuEles.forEach((item)=>{
                        item.classList.remove("active");
                    });
                    /*li.children[1]就是li的第二个属性，即二级菜单*/
                    li.children[1].classList.add("active");
                },200);
            });
        });

        /*鼠标移动出一级菜单项事件*/
        this.lis.forEach((item) => {
            item.addEventListener("mouseleave",(e)=> {
                let li = e.target;
                console.log("鼠标移动出事件");
                if(this.timer2 != null) {
                    clearTimeout(this.timer2);
                }
                /*200ms再去作里面的事*/
                this.timer2 = setTimeout(()=>{
                    this.subMenuEles.forEach(()=>{
                        /*鼠标移动出去，二级菜单消失*/
                        li.children[1].classList.remove("active");
                    });
                },200);
            });
        });
    }
}