<template>
  <div>
    <!--      面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片试图区-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!--        搜索添加区域-->
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="userList"></el-button>
          </el-input>
        </el-col>
        <el-col :space="4"></el-col>
        <el-button type="primary">添加用户</el-button>
      </el-row>
<!--      用户展示区-->
      <el-table :data="users" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.states">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>
<!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    username: '',
                    size:2,
                    current:1
                },
                users: [],
                total:0
            }
        },
        // 生命周期函数
        created() {
            this.userList()
        },
        methods: {
            userList() {
                this.$http
                    .get('user/page', {params: this.queryInfo}).then(res => {
                        if (res.data.status === 1) {
                            this.users = res.data.data.records
                            this.total = parseInt(res.data.data.total)
                        }
                    })
            },
            //监听pagesize改变的事件
            handleSizeChange(newSize){
                this.queryInfo.size = newSize
                this.userList()
            },
            //监听页码值改变的事件
            handleCurrentChange(newPage){
                this.queryInfo.current = newPage
                this.userList()
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
