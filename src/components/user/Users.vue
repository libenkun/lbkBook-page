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
          <el-input placeholder="请输入内容" v-model="queryInfo.username" clearable @clear="userList">
            <el-button slot="append" icon="el-icon-search" @click="userList"></el-button>
          </el-input>
        </el-col>
        <el-col :space="4"></el-col>
        <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
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
              v-model="scope.row.states" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removerUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
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
    <!--    添加用户对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
      <!--      内容主题区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改用户-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
    <!--    分配角色-->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%">
      <div>
        <p>当前用户:{{userInfo.username}}</p>
        <p v-for="i in userInfo.role">当前角色:{{i.roleName}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        data() {
            // 邮箱验证
            var checkEmail = (rule, value, cb) => {
                //验证邮箱正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    // 合法
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }

            // 手机验证
            var checkPhone = (rule, value, cb) => {
                //验证手机号的正则表达式
                const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57]|19[0-9])[0-9]{8}$/
                if (regPhone.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法手机号'))
            }
            return {
                queryInfo: {
                    username: '',
                    size: 2,
                    current: 1
                },
                // 需要被分配角色用户信息
                userInfo: {},
                // 角色数据列表
                rolesList: [],
                // 选中的角色值
                selectedRoleId: '',
                users: [],
                total: 0,
                // 对话框显示与隐藏
                addDialogVisible: false,
                // 添加用户的表单数据
                addForm: {
                    username: '',
                    password: '',
                    phone: '',
                    email: ''
                },
                // 添加表单验证对象
                addFormRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '用户名长度在 3到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '用户密码 3到 10 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
                // 修改用户对话框
                editDialogVisible: false,
                editForm: {},
                //修改表单验证
                editFormRules: {
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
                // 分配角色对话框
                setRoleDialogVisible: false
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
                    if (res.status === 200) {
                        this.users = res.data.data.records
                        this.total = parseInt(res.data.data.total)
                    }
                })
            },
            //监听pagesize改变的事件
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize
                this.userList()
            },
            //监听页码值改变的事件
            handleCurrentChange(newPage) {
                this.queryInfo.current = newPage
                this.userList()
            },
            //监听switch开关的改变
            userStateChanged(userInfo) {
                console.info(userInfo)
                this.$http.post('user/update', userInfo)
                    .then(res => {
                        if (res.data.status === 1) {
                            return this.$message.success('更新用户状态成功！！')
                        } else {
                            userInfo.states = !userInfo.states
                            return this.$message.error('请检查参数')
                        }
                    })
            },
            //监听添加用户对话框的关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            //添加新用户
            addUser() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return
                    this.$http.post('/user/add', this.addForm)
                        .then(res => {
                            if (res.data.status === 1) {
                                this.$message.success("用户添加成功！")
                                //隐藏用户添加对话框
                                this.addDialogVisible = false
                                this.userList()
                            }
                        })
                })
            },
            // 用户编辑
            showEditDialog(id) {
                this.$http
                    .get('/user/userById/' + id)
                    .then(res => {
                        if (res.status === 200) {
                            this.editForm = res.data.data
                            this.editDialogVisible = true
                        } else {
                            return this.$message.error('用户查询失败')
                        }
                    })
            },
            // 修改用户对话框的关闭事件
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            // 修改用户信息并提交
            editUserInfo() {
                this.$refs.editFormRef.validate(valid => {
                    if (!valid) return
                    // 发起修改用户信息的数据请求
                    this.$http
                        .post('user/update', this.editForm).then(res => {
                        if (res.status !== 200) {
                            return this.$message.error('修改失败')
                        }
                        //关闭对话框
                        this.editDialogVisible = false
                        //刷新数据列表
                        this.userList()
                        //提示修改成功
                        this.$message.success('修改用户成功')
                    })
                })
            },
            // 根据id删除对应的用户
            async removerUserById(id) {
                // 询问是否删除数据
                confirmResult = this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http
                        .delete('user/remover/' + id).then(res => {
                        if (res.status !== 200) {
                            return this.$message.error('删除失败')
                        }
                        this.$message.success('删除成功')
                        this.userList()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })


            },
            // 展示分配角色对话框
            setRole(userInfo) {
                this.userInfo = userInfo
                // 在展示对话框前，获取所有角色的列表
                this.$http.get('role/roles')
                    .then(res => {
                            if (res.status !== 200) {
                                return this.$message.error('角色列表为空')
                            }
                            this.rolesList = res.data.data
                        }
                    )
                this.setRoleDialogVisible = true
            },
            saveRoleInfo() {
                if (!this.selectedRoleId) {
                    return this.$message.error('请选择要分配的角色')
                }

                this.$http.post('userRole/updateByRoleId',{roleId: this.selectedRoleId,
                    userId: this.userInfo.id}).then(res => {
                    if (res.status !== 200) {
                        return this.$message.error('修改失败')
                    }
                    this.setRoleDialogVisible = false
                    return this.$message.success('修改成功');
                })

            }
        }
    }
</script>

<style lang="less" scoped>

</style>
