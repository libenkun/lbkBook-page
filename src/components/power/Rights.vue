<template>
  <div>
    <!--      面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="权限等级" prop="types"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                rightsList: []
            }
        },
        created() {
            this.getRightsList()
        },
        methods: {
            //获取权限列表
            getRightsList() {
                this.$http
                    .get('permission/list')
                    .then(res => {
                        if (res.status !== 200) {
                            return this.$message.error('获取失败')
                        }
                        this.rightsList = res.data.data
                    })
            }
        }
    }
</script>

<style scoped>

</style>
