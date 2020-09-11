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
          <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addDialogVisible=true">动态参数
          </el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableDate" border stripe>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="valued"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="remover(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--        添加静态属性面板-->
        <el-tab-pane label="静态属性" name="2">
          <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addDialogVisible=true">静态参数
          </el-button>
          <el-table :data="onlyTableDate" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="valued"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="remover(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加'+ titleText"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClose">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="valued">
          <el-input v-model="addForm.valued"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改'+ titleText"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClose">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="valued">
          <el-input v-model="editForm.valued"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
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
                onlyTableDate: [],
                //控制添加对话框的显示与隐藏
                addDialogVisible: false,
                editDialogVisible: false,
                addForm: {
                    valued: ''
                },
                editForm: {},
                addFormRules: {
                    valued: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'}
                    ]
                },
                editFormRules: {
                    valued: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'}
                    ]
                }
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
            },
            addDialogClose() {
                this.$refs.addFormRef.resetFields()
            },
            //添加参数
            addParams() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return
                    this.$http.post('explain/add', {
                        valued: this.addForm.valued,
                        types: this.activeName,
                        categoryId: this.cateId
                    }).then(res => {
                        if (res.status !== 200) {
                            return this.$message.error("添加参数失败")
                        }
                        this.$message.success("添加成功")
                        this.addDialogVisible = false
                        this.getParamsData()
                    })
                })
            },
            showEditDialog(id) {
                this.$http.get('explain/details/' + id)
                    .then(res => {
                        if (res.status !== 200) {
                            return this.$message.error("查询失败")
                        }
                        this.editForm = res.data.data
                        this.editDialogVisible = true
                    })
            },
            editDialogClose() {
                this.$refs.editFormRef.resetFields()
            },
            //修改参数信息
            editParams() {
                this.$refs.editFormRef.validate(valid => {
                    if (!valid) return
                    this.$http.post('explain/update', this.editForm)
                        .then(res => {
                            if (res.status !== 200) {
                                return this.$message.error("修改失败")
                            }
                            this.editDialogVisible = true
                            this.getParamsData()
                            return this.$message.success("修改成功")
                        })
                })
            },

            async remover(id) {
                console.log(id)
                // 询问是否删除数据
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http
                        .delete('explain/remover/' + id).then(res => {
                        if (res.status !== 200) {
                            return this.$message.error('删除失败')
                        }
                        this.$message.success("删除成功")
                        this.getParamsData()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
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
            },
            //动态计算标题的文本
            titleText() {
                if (this.activeName === '1') {
                    return '动态参数'
                }
                return '静态属性'
            }
        }
    }
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0;
  }
</style>
