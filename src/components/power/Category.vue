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
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
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
    <!--    分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialoVisible"
      width="50%" @close="addDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="活动名称：" prop="name">
          <el-input v-model="addCateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--  options 指定数据源-->
          <!-- props 指定配置对象-->
          <el-cascader
            expand-trigger="hover"
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialoVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
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
                ],
                addCateDialoVisible: false,
                //添加分类的表单数据对象
                addCateForm: {
                    name: '',
                    pid: 0

                },
                //添加分类表单的验证规则对象
                addCateFormRules: {
                    name: [
                        {required: true, message: '请输分类名称', trigger: 'blur'}
                    ]
                },
                //父级分类列表
                parentCateList: [],
                //指定级联选择器的配置对象
                cascaderProps: {
                    value: 'id',
                    label: 'name',
                    children: 'list'
                },
                //选中的父级分类的Id数组
                selectKeys: []
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
            handleSizeChange(newSize) {
                this.querInfo.size = newSize
                this.getCateList()
            },
            //
            handleCurrentChange(newCurrent) {
                this.querInfo.current = newCurrent
                this.getCateList()
            },
            //添加分类
            showAddCateDialog() {
                //先获取父级数据列表
                this.getParentCateList()
                this.addCateDialoVisible = true
            },
            //获取父级数据列表
            getParentCateList() {
                this.$http
                    .get('category/list')
                    .then(res => {
                        if (res.status !== 200) {
                            return this.$message.error("父级列表获取失败")
                        }
                        this.parentCateList = res.data.data
                        console.log(this.parentCateList)
                    })
            },
            //选择项发生变化触发这个函数
            parentCateChanged() {
                console.log(this.selectKeys)
                //如果selectKeys数组中的length大于0,证明选中的父级分类
                //反之，就没有选中任何父级分类
                if (this.selectKeys.length > 0) {
                    //父级分类的id
                    this.addCateForm.pid = this.selectKeys[this.selectKeys.length - 1]
                    return
                } else {
                    this.addCateForm.pid = 0
                }
            },
            addCate() {
                this.$refs.addCateFormRef.validate(valid => {
                    if (!valid) return

                    this.$http
                        .post('category/add', this.addCateForm)
                        .then(res => {
                            if (res.status !== 200) {
                                return this.$message.error("分类添加失败")
                            }
                            this.getCateList();
                            this.addCateDialoVisible = false
                            return this.$message.success("分类添加成功！")
                        })
                })
            },
            //监听添加用户对话框的关闭事件
            addDialogClosed() {
                this.$refs.addCateFormRef.resetFields()
                this.selectKeys = []
                this.addCateForm.pid = 0
            }
        }
    }
</script>

<style scoped lang="less">
  .treeTable {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
