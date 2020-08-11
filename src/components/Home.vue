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
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse" >|||</div>
<!--        侧边栏菜单区-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObje[item.id]"></i>
              <span>{{item.menuName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path +''" v-for="subItem in item.menusChild" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.menuName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>

</template>

<script>
export default {
    data(){
        return{
            menulist:[],
            iconsObje:{
                '1290188164052922369':'iconfont icon-icontouxiang',
                '1292725922017406978':'iconfont icon-tijikongjian',
                '1292726137977925633':'iconfont icon-shangpingouwudai2',
                '1292726267183460353':'iconfont icon-danju-tianchong',
                '1292726380085735426':'iconfont icon-baobiao'
            },
            isCollapse:false,
            //被激活的连接地址
            activePath:''
        }
    },
    created(){
        this.getMenuList(),
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    name: "Home",
    methods:{
            logout(){
                window.sessionStorage.clear();
                this.$router.push("/login").catch(err=>err);
            },
        //获取菜单
        getMenuList(){
          let menus = JSON.parse(localStorage.getItem("user"))
            this.menulist=menus.menus;
        },
        //折叠和展开
        toggleCollapse(){
          this.isCollapse=!this.isCollapse
        },
        //保存链接的激活状态
        saveNavState(activePath){
                window.sessionStorage.setItem('activePath',activePath)
                this.activePath = activePath;
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
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height:24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor:pointer;
  }
</style>
