<!-- 图片裁剪组件 -->
<template>
  <div class="tailoring-container" v-show="myDialogVisible">
    <div class="black-cloth" @click="closeTailor(this)"></div>
    <div class="tailoring-content">
      <div class="tailoring-content-one">
        <label title="上传图片" for="chooseImg" class="btn btn-pink choose-btn">
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            name="file"
            id="chooseImg"
            class="hidden"
            v-on:change="selectImg"
          />
          选择图片
        </label>
        <div class="close-tailoring" @click="closeTailor(this)">×</div>
      </div>
      <div class="tailoring-content-two">
        <div class="tailoring-box-parcel">
          <img id="tailoringImg" />
        </div>
      </div>
      <div class="tailoring-content-three">
        <button class="btn btn-pink" @click="resetBtn">复位</button>
        <button class="btn btn-pink" @click="rotateBtn">旋转</button>
        <button class="btn btn-pink" @click="scaleXBtn">换向</button>
        <button class="btn btn-pink sureCut" id="sureCut" @click="sureBtn">确定</button>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import $ from 'jquery';
import cropper from '../../node_modules/cropper/dist/cropper';
import '../../node_modules/_cropper@4.1.0@cropper/dist/cropper.css';

export default {
  props: {
    dialogVisible: Boolean
  },
  data: function() {
    return {
      flagX: true,
      myDialogVisible: this.dialogVisible
    };
  },
  methods: {
    closeTailor: function() {
      this.myDialogVisible = false;
      this.$emit("on-dialog-close",false);
    },
    selectImg: function() {
      // 获得上传的图片的文件对象
      let file = $("#chooseImg")[0].files[0];
      if (file === null) {
        return;
      }
      let reader = new FileReader();
      reader.onload = function(evt) {
        let replaceSrc = evt.target.result;
        //更换cropper的图片
        $("#tailoringImg").cropper("replace", replaceSrc, false); //默认false，适应高度，不失真
      };
      reader.readAsDataURL(file);
    },
    resetBtn: function() {
      $("#tailoringImg").cropper("reset");
    },
    rotateBtn: function() {
      $("#tailoringImg").cropper("rotate", 45);
    },
    scaleXBtn: function() {
      if (this.flagX) {
        $("#tailoringImg").cropper("scaleX", -1);
        this.flagX = false;
      } else {
        $("#tailoringImg").cropper("scaleX", 1);
        this.flagX = true;
      }
    },
    sureBtn: function() {
      let $tImg = $("#tailoringImg");
      if ($tImg.attr("src") == null) {
        return false;
      } else {
        let cas = $tImg.cropper("getCroppedCanvas"); //获取被裁剪后的canvas
        let base64url = cas.toDataURL("image/png"); //转换为base64地址形式
        let imgName = $("#chooseImg").val(); // 获取图片名
        // 调用关闭当前图像编辑框的函数
        this.closeTailor();
        // 将图片的base64格式的url和图片名传回父组件，以供父组件接下来使用
        this.$emit("on-sure-cut", base64url, imgName);
      }
    }
    // 监听父组件传值，和当该组件状态改变时告知父组件
  },
  watch: {
    dialogVisible(val) {
      this.myDialogVisible = val;
    }
  }
};
//cropper图片裁剪
$("#tailoringImg").cropper({
  aspectRatio: 1 / 1, //默认比例
  // preview: ".previewImage",//预览视图
  guides: true, //裁剪框的虚线(九宫格)
  autoCropArea: 0.5, //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
  movable: false, //是否允许移动图片
  dragCrop: true, //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
  resizable: true, //是否允许改变裁剪框的大小
  zoomable: false, //是否允许缩放图片大小
  mouseWheelZoom: false, //是否允许通过鼠标滚轮来缩放图片
  touchDragZoom: true, //是否允许通过触摸移动来缩放图片
  rotatable: true, //是否允许旋转图片
  crop: function(e) {
    // 输出结果数据裁剪图像。
  }
});

// 定位函数，对不同高宽的页面进行响应式显示
function resize() {
  let win_height = $(window).height();
  let win_width = $(window).width();
  let $tailContent = $(".tailoring-content");
  if (win_width <= 768) {
    $tailContent.css({
      top: (win_height - $tailContent.outerHeight()) / 2,
      left: 0
    });
  } else {
    $tailContent.css({
      top: (win_height - $tailContent.outerHeight()) / 2,
      left: (win_width - $tailContent.outerWidth()) / 2
    });
  }
}

$(function() {
  // 根据页面宽度自动调整裁切图片框的位置
  resize();
});
</script>


<style>
@import url("../../static/css/custom.css");
/* 登录按钮样式 */
.l-btn {
  display: inline-block;
  outline: none;
  resize: none;
  border: none;
  padding: 5px 10px;
  background: #8c85e6;
  color: #fff;
  border: solid 1px #8c85e6;
  border-radius: 3px;
  font-size: 14px;
}
.l-btn:hover {
  background: #8078e3;
  animation: anniu 1s infinite;
}
.l-btn:active {
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2) inset;
}
.hidden {
  display: none;
}
.tailoring-container,
.tailoring-container div,
.tailoring-container p {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.tailoring-container {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10000;
  top: 0;
  left: 0;
  animation-name: fade-in-top;
  animation-duration: 1s;
  animation-fill-mode: both;
}
.tailoring-container .black-cloth {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #111;
  opacity: 0.9;
  z-index: 1001;
}
.tailoring-container .tailoring-content {
  position: absolute;
  width: 768px;
  height: 570px;
  background-color: #2d3035 !important;
  z-index: 1000002;
  left: 0;
  top: 0;

  /* 水平垂直居中 浏览器版本号低的不支持transform */
  /*left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    -weblit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);*/

  border-radius: 10px;
  box-shadow: 0 0 10px #000;
  padding: 10px;
}

.tailoring-content-one {
  height: 40px;
  width: 100%;
}
.tailoring-content .choose-btn {
  float: left;
}
.tailoring-content .close-tailoring {
  float: right;
  display: block;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  color: #2d3035;
  background: #34373d;
  transition: all 0.7s ease 0s;
  -webkit-transition: all 0.7s ease 0s;
  -moz-transition: all 0.7s ease 0s;
  font-size: 22px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
.tailoring-content .close-tailoring:hover {
  background: #2d3035;
  color: #34373d;
}

.tailoring-content .tailoring-content-two {
  width: 100%;
  height: 460px;
  position: relative;
  padding: 5px 0;
}
.tailoring-content .tailoring-box-parcel {
  width: 100%;
  height: 450px;
  position: absolute;
  left: 0;
  border: 1px solid #22252a;
}
.tailoring-content .preview-box-parcel {
  display: inline-block;
  width: 228px;
  height: 450px;
  position: absolute;
  right: 0;
  padding: 4px 14px;
}
.preview-box-parcel p {
  color: #555;
}
.previewImage {
  width: 200px;
  height: 200px;
  overflow: hidden;
}
.preview-box-parcel .square {
  margin-top: 10px;
  border: solid 1px #ddd;
}
.preview-box-parcel .circular {
  border-radius: 100%;
  margin-top: 10px;
  border: solid 1px #ddd;
}

.tailoring-content .tailoring-content-three {
  width: 100%;
  height: 40px;
  padding-top: 10px;
}
.sureCut {
  float: right;
}

@media all and (max-width: 768px) {
  .tailoring-container .tailoring-content {
    width: 100%;
    min-width: 320px;
    height: 470px;
  }
  .tailoring-content .tailoring-content-two {
    height: 360px;
  }
  .tailoring-content .tailoring-box-parcel {
    height: 350px;
  }
  .tailoring-container .tailoring-box-parcel {
    width: 100%;
  }
  .tailoring-container .preview-box-parcel {
    display: none;
  }
}
</style>
