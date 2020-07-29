<template>
  <div class="login_container">
    <div class="login_box">
<!--      头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
<!--      表单区域-->
      <el-form label-width="0px" class="lgin_form">
        <el-form-item>
          <el-input prefix-icon="iconfont icon-touxiang"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Login"
    }
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius:50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      transform: translate(-50%,-50%);
      left: 50%;
      background-color: #ffffff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .btn{
      display: flex;
      justify-content: flex-end;
    }
    .lgin_form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
</style>
