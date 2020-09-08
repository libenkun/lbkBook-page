<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning" :closable="false">
      </el-alert>
      <!--        选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!--          选择商品分类的级联选择-->
          <el-cascader
            expand-trigger="hover"
            v-model="selectCategoryKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange" clearable change-on-select>
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handTableClick">
        <!--        添加动态参数面板-->
        <el-tab-pane label="动态参数" name="1">
          <el-button :disabled="isBtnDisabled" type="primary" size="mini">动态参数</el-button>
          <!--          动态参数表格-->
          <el-table :data="manyTableDate" border stripe>
            <!--            索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="valued"></el-table-column>
          </el-table>
        </el-tab-pane>
        <!--        添加静态属性面板-->
        <el-tab-pane label="静态属性" name="2">
          <el-button :disabled="isBtnDisabled" type="primary" size="mini">添加属性</el-button>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="valued"></el-table-column>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                //商品分类
                catelist: [],
                cateProps: {
                    value: 'id',
                    label: 'name',
                    children: 'list'
                },
                // 级联选择双向绑定
                selectCategoryKeys: [],
                activeName: '1',
                //动态参数
                manyTableDate: [],
                //静态数据
                onlyTableDate: []
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            getCateList() {
                this.$http
                    .get('category/categoryList')
                    .then(res => {
                        if (res.status !== 200) {
                            return this.$message.error("分类查询失败")
                        }
                        this.catelist = res.data.data
                    })
            },
            handleChange() {
                this.getParamsData()

            },
            // tab页签点击事件的处理函数
            handTableClick() {
                this.getParamsData()
            },
            //获取参数的列表数据
            getParamsData() {
                if (this.selectCategoryKeys.length !== 3) {
                    this.selectCategoryKeys = []
                    return
                }

                //根据所选分类的id，和当前所处额面板，获取对应的参数
                this.$http
                    .get('explain/findExplain', {params: {types: this.activeName, categoryId: this.cateId}})
                    .then(res => {
                        if (res.status !== 200) {
                            return this.$message.error("查询失败")
                        }
                        if (this.activeName === '1') {
                            this.manyTableDate = res.data.data
                        } else {
                            this.onlyTableDate = res.data.data
                        }

                    })
            }
        },
        computed: {
            //如果按钮需要被禁用，则返回true，否则返回false
            isBtnDisabled() {
                if (this.selectCategoryKeys.length !== 3) {
                    return true
                }
                return false
            },
            //当前选中的三级分类id
            cateId() {
                if (this.selectCategoryKeys.length === 3) {
                    return this.selectCategoryKeys[2]
                }
                return null
            }
        }
    }
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0;
  }
</style>
