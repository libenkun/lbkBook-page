<template>
  <div id="home">
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/img.jpg" alt="" width="50px" height="50px">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
<!--        侧边栏菜单区-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航</span>
            </template>
            <el-menu-item index="1-4-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
  </div>

</template>

<script>
export default {
    created(){
        this.getMenuList()
    },
    name: "Home",
    methods:{
            logout(){
                window.sessionStorage.clear();
                this.$router.push("/login");
            },
        //获取菜单
        getMenuList(){
          let menus = JSON.parse(localStorage.getItem("user"))
            this.data.menu = menus
          console.info(menus)
        }
    }
    }
</script>

<style lang="less" scoped>
  #home{
    height: 100%;
    overflow: hidden;
  }
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-content: center;
    color: #fff;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
  }
  .el-main{
    background-color: #eaedf1;
  }
</style>
