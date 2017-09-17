/**
 * Created by BWInk on 2017/9/13.
 */
;(function ($) {
    var _that;
    function _slider(conf) {
        _that = this;
        var def = {   //默认样式
            boxH:340,//盒子的高度
            boxW:790,//盒子的宽度
            contH:340,//内容的高度
            isShowBtn:true,//是否显示左右按钮
            btnColor:"#000",//左右按钮的颜色
            btnOpacity:0.5,  //左右按钮的透明度
            btnDefShow:true,//左右按钮是否鼠标不移入时也显示
            isShowControl:true,//是否显示控制器
            controlBottom:20,//控制按钮距离底部的位置
            controlGap:10,//控制按钮之间的间距
            controlsW:20,//控制按钮宽度
            controlsH:20,//控制按钮高度
            radius:10,//控制按钮圆角度数
            controlsColor:"#fff",//普通控制按钮的颜色
            controlsFontColor:"#000",//普通控制按钮数字的颜色
            currentOpacity:0.9,  //控制按钮的透明度
            currentFontSize:14,//控制按钮的文字大小
            controlsCurrentColor:"#ff6600",//当前控制按钮的颜色
            currentFontColor:"#fff",//当前控制按钮的文字颜色
            isShowNumber:true   //控制按钮是否显示数字
        }

        var conf = $.extend({},def,conf);   //合并默认样式获取到的数据,以获取到的为主,没有的则以默认的为主
        $(this).each(function (index,item) {   //使用遍历是为了实现同个页面使用多个轮播
            $(item).css({"height":conf.boxH,"width":conf.boxW}); //设置盒子的宽高
            $(item).find(".slideCon li").css("height",conf.contH);  //设置内容的高度
            $(item).find(".slideCon li>img").css({"height":conf.contH,"width":conf.boxW});  //如果内容直接就是图片,那么设置该图片的高度等于内容的高度

            //设置左右按钮的状态
            var top = (conf.contH - parseInt($(item).find(".btn").css("height")))/2;  //计算按钮距离顶部的位置(用于将按钮垂直居中)
            $(item).find(".btn").css({"backgroundColor":conf.btnColor,"opacity":conf.btnOpacity,"top":top});
            //根据是否显示左右按钮以及是否在鼠标没移入时也显示左右按钮来设置按钮的状态
            if(conf.isShowBtn && conf.btnDefShow){
                $(item).find(".btn").show();
            }else{
                $(item).find(".btn").hide();
            }

            //复制首尾的li并交叉插入到ul的首位位置
            var slideCon = $(item).find(".slideCon");
            var cloneFirst = slideCon.find("li:first").clone();
            var cloneLast = slideCon.find("li:last").clone();
            slideCon.append(cloneFirst).prepend(cloneLast);
            slideCon.css("width",slideCon.find("li").length * conf.boxW);
            slideCon.css("left",-conf.boxW);

            //设置控制器样式
            //当需要显示控制器时才进行控制器的样式操作
            if(conf.isShowControl) {
                //根据图片的具体数量修改轮播中的数字显示总量
                //去掉首尾插入实际需要的数量
                var imgNum = slideCon.find("li").length - 2;
                var slideNum = $(item).find(".slideNum");
                //先清空轮播数字里的所有li,再重新添加实际需要的数量
                slideNum.empty();
                for (var i = 0; i < imgNum; ++i) {
                    if(conf.isShowNumber){   //需要显示数字时
                        slideNum.append("<li>" + (i + 1) + "</li>");
                    }else{    //无需显示数字时
                        slideNum.append("<li></li>");
                    }
                }
                //设置控制按钮样式
                slideNum.find("li").css({
                    "width": conf.controlsW,
                    "height": conf.controlsH,
                    "line-height":conf.controlsH+"px",
                    "borderRadius": conf.radius,
                    "marginLeft": conf.controlGap/2,
                    "marginRight": conf. controlGap/2,
                    "backgroundColor": conf.controlsColor,
                    "color": conf.controlsFontColor,
                    "fontSize": conf.currentFontSize,
                    "opacity":conf.currentOpacity
                });
                //设置slideNum的left值来控制居中
                slideNum.css({"left": (conf.boxW - parseInt(slideNum.css("width"))) / 2,"bottom": conf.controlBottom});
                //默认第一个num点亮
                slideNum.find("li:first").css({"backgroundColor": conf.controlsCurrentColor, "color": conf.currentFontColor});
            }else{   //不需要显示控制器时直接隐藏
                $(item).find(".slideNum").hide();
            }

            //轮播处理
            //currentIndex 控制当前显示图片的索引
            var currentIndex = 1;
            //下一张
            $(item).find(".rightBtn").click(function () {
                //只有当没有动画在执行时才会调用下面的函数,避免动画积累
                if(!(slideCon.is(":animated"))){
                    ++currentIndex;
                    bannerPlay();
                }
            });
            //上一张
            $(item).find(".leftBtn").click(function () {
                //只有当没有动画在执行时才会调用下面的函数,避免动画积累
                if(!(slideCon.is(":animated"))) {
                    --currentIndex;
                    bannerPlay();
                }
            });

            //轮播函数
            function bannerPlay() {
                //当滚到复制并插入到最后的图片(效果中的第一张图)时,回调函数(animate的最后一个可选参数,在动画执行完毕后执行该函数)将slideCon的位置跳到第二张图片(效果中被复制的第一张图)的位置
                if(currentIndex==slideCon.find("li").length-1){
                    slideCon.animate({"left":-conf.boxW*currentIndex},500,function () {
                        currentIndex = 1;
                        slideCon.css("left",-conf.boxW);
                    });
                }
                //当滚到复制并插入到首位的图片(效果中的最后一张张图)时,回调函数将slideCon的位置跳到第二张图片(效果中被复制的最后一张图)的位置
                else if(currentIndex==0){
                    slideCon.animate({"left":-conf.boxW*currentIndex},500,function () {
                        currentIndex = slideCon.find("li").length-2;
                        slideCon.css("left",-conf.boxW*(slideCon.find("li").length-2));
                    });
                }else{
                    slideCon.animate({"left":-conf.boxW*currentIndex},500);
                }
                //改变数字
                changeNumber();
            }

            //自动播放
            var autoPlay = setInterval(function () {
                currentIndex++;
                bannerPlay();
            },3000);

            //鼠标移上去时停止自动播放并显示切换按钮
            $(item).hover(function () {
                //移入
                window.clearInterval(autoPlay);
                if(conf.isShowBtn){
                    $(item).find(".btn").show();
                }
            },function () {
                //移出
                autoPlay = setInterval(function () {
                    currentIndex++;
                    bannerPlay();
                },3000);
                if(!conf.btnDefShow){
                    $(item).find(".btn").hide();
                }
            });

            //点击指定的数字就跳到对应数字的图片
            $(item).find(".slideNum li").click(function () {
                currentIndex=$(this).index()+1;
                bannerPlay();
            });

            //数字改变函数
            function changeNumber() {
                if(currentIndex ==slideCon.find("li").length-1){
                    $(item).find(".slideNum li").eq(0).css({"backgroundColor": conf.controlsCurrentColor, "color": conf.currentFontColor}).siblings().css({"backgroundColor": conf.controlsColor,"color": conf.controlsFontColor});
                }else{
                    $(item).find(".slideNum li").eq(currentIndex-1).css({"backgroundColor": conf.controlsCurrentColor, "color": conf.currentFontColor}).siblings().css({"backgroundColor": conf.controlsColor,"color": conf.controlsFontColor});
                }
            }

        });

        return _that;
    }
    $.fn.slider = _slider;
})(jQuery);