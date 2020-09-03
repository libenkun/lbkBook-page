<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!--        表格-->
      <tree-table class="treeTable" :data="cateList" :columns="columns"
                  show-index index-text="#"
                  :expand-type="false"
                  :selection-type="false" border :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.states = 1"
          style="color: lightgreen;"></i>
          <i class="el-icon-error" style="color: red;" v-else></i>
        </template>
      </tree-table>
      <!--        分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.current"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.size"
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
                querInfo: {
                    size: 5,
                    current: 1
                },
                //商品分类的数据列表，默认为空
                cateList: [],
                total: 0,
                //为table指定列的定义
                columns: [
                    {
                        label: '分类名称',
                        prop: 'name'
                    },
                    {
                        label: '是否有效',
                        //将当前列指定为模板列
                        type: 'template',
                        //表示当前这一列使用模板名称
                        template: 'isok'
                    }
                ]
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            //获取商品分类数据
            getCateList() {
                this.$http.get('category/page', {params: this.querInfo})
                    .then(res => {
                        if (res.status !== 200) {
                            return this.$message.error('查询失败')
                        }
                        this.cateList = res.data.data.records
                        this.total = parseInt(res.data.data.total)
                    })
            },
            //监听size改变
            handleSizeChange(newSize){
                this.querInfo.size = newSize
                this.getCateList()
            },
            //
            handleCurrentChange(newCurrent){
              this.querInfo.current = newCurrent
              this.getCateList()
            },
        }
    }
</script>

<style scoped lang="less">
.treeTable{
  margin-top: 15px;
}
</style>
