<template>
  <div>
    <!--      面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <!--        角色列表-->
      <el-table :data="rolelist" border stripe>
        <!--          展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1 ===0 ? 'bdtop':'']" v-for="(item1,i1) in scope.row.permission"
                    :key="item1.id">
              <!--              一级权限-->
              <el-col :span="5">
                <el-tag>
                  {{item1.name}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2 ===0 ? '':'bdtop']" v-for="(item2,i2) in item1.permissionList" :key="item2.id">
                  <el-col>
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col></el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="picture"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="remover(scope.row.id)">删除</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--      添加-->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
      <!--      内容主题区域-->
      <el-form :model="addRolesFom" :rules="addRoleRules" ref="addRoleRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesFom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="picture">
          <el-input v-model="addRolesFom.picture"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editsRole" :rules="addRoleRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editsRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="picture">
          <el-input v-model="editsRole.picture"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%" @close="setRightDialogClosed">
<!--      树形控件-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                rolelist: [],
                rightslist:[],
                // 树形控件属性绑定对象
                treeProps:{
                    label:'name',
                    children:'permissionList'
                },
                // 默认选中的节点id值
                defKeys:[],
                addRolesFom: {
                    roleName: '',
                    picture: ''
                },
                editsRole: {},
                addDialogVisible: false,
                editDialogVisible: false,
                // 分配权限对话框
                setRightDialogVisible: false,
                //表单验证
                addRoleRules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '用户名长度在 2到 10 个字符', trigger: 'blur'}
                    ],
                    picture: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {min: 5, max: 10, message: '描述长度在 5到 15 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getRoleList()
        },
        methods: {
            getRoleList() {
                this.$http
                    .get("role/list")
                    .then(res => {
                        if (res.status !== 200) {
                            return this.$message.error("查询失败")
                        }
                        this.rolelist = res.data.data
                    })
            },
            addDialogClosed() {
                this.$refs.addRoleRef.resetFields()
            },
            // 修改用户对话框的关闭事件
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            addRoles() {
                this.$refs.addRoleRef.validate(valid => {
                    if (!valid) return
                    this.$http
                        .post('role/add', this.addRolesFom)
                        .then(res => {
                            if (res.status !== 200) {
                                return this.$message.error("角色添加失败")
                            }
                            this.$message.success('角色添加成功')
                            this.addDialogVisible = false
                            this.getRoleList()
                        })
                })
            },
            editRole(id) {
                this.$http
                    .get('role/getRole/' + id)
                    .then(res => {
                        if (res.status !== 200) {
                            return this.$message.error("查询失败")
                        }
                        this.editsRole = res.data.data
                        this.editDialogVisible = true
                    })
            },
            // setEdit(data) {
            //     delete data.createTime
            //     delete data.updateTime
            //     return data
            // },
            editRoleInfo() {
                this.$refs.editFormRef.validate(valid => {
                    if (!valid) return
                    this.$http.post('role/update', this.editsRole)
                        .then(res => {
                            if (res.status !== 200) {
                                return this.$message.error('修改失败')
                            }

                            this.editDialogVisible = false
                            this.getRoleList()
                        })
                })
            },
            async remover(id) {
                // 询问是否删除数据
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http
                        .delete('role/remover/' + id).then(res => {
                        if (res.status !== 200) {
                            return this.$message.error('删除失败')
                        }
                        this.$message.success("删除成功")
                        this.getRoleList()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
            async removeRightById(role, id) {
                //弹框
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消删除')
                }
                this.$http.delete('permission/' + id)
                    .then(res => {
                        if (res.status !== 200) {
                            return this.$message.error('删除是吧')
                        }
                        this.rolelist = res.data.data
                    })

            },
            // 分配权限对话框
            showSetRightDialog(role) {
                //获取所有权限
                this.$http
                    .get('permission/tree')
                    .then(res=>{
                        if (res.status !==200){
                            return this.$message.error('查询失败')
                        }
                      this.rightslist = res.data.data
                    })
                this.getLeafKeys(role,this.defKeys)
                this.setRightDialogVisible = true
            },
            // 通过递归形式获取角色下的权限。并保存到defKeys数组中
            getLeafKeys(node,arr){
              // 如果当前node节点不包含children属性，则是二级节点
              if (!node.permission){
                  return arr.push(node.id)
            }
              node.permission.forEach(item=>{
              this.getLeafKeys(item,arr)
            })
            },
            // 监听分配权限对话框的关闭实践
            setRightDialogClosed(){
                this.defKeys = []
            },
            allotRights(){
                const  keys = [
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]

                console.log(keys)
            }
        }

    }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }
</style>
