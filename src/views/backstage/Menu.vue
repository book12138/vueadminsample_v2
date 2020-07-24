<template>
  <section>
    <!--工具条-->
    <div class="toolbar">
      <el-input
        placeholder="请输入内容"
        v-model="searchContent"
        class="input-with-select searchBox"
        @keyup.enter.native="search"
      >
        <el-select v-model="searchType" style="width:110px" slot="prepend" placeholder="请选择">
          <el-option label="菜单名称" value="1"></el-option>
          <el-option label="创建人" value="2"></el-option>
          <el-option label="修改人" value="3"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>

      <el-button-group style="padding-left:30px;">
        <el-button type="primary" icon="el-icon-plus" @click="showAddNewForm">添加新项</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="showBulkEdit">批量编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="bulkRemove">批量删除</el-button>
      </el-button-group>
    </div>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      @current-change="selectCurrentRow"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column label="菜单" width="200" sortable>
        <template slot-scope="scope">
          <i class="fa" :class="scope.row.Icon"></i>
          {{scope.row.Name}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="PnameArr" label="父节点" width="" sortable>
      </el-table-column>-->
      <el-table-column prop="url" label="路由地址" width sortable></el-table-column>
      <el-table-column prop="desc" label="描述" width sortable></el-table-column>
      <el-table-column prop="sort" label="排序" width sortable></el-table-column>
      <el-table-column prop="isShow" label="是否显示" width="100" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="!scope.row.isShow  ? 'success' : 'danger'"
            disable-transitions
          >{{!scope.row.isShow ? "否":"是"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="状态" width="100" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="!scope.row.IsHide  ? 'success' : 'danger'"
            disable-transitions
          >{{!scope.row.enable ? "已禁用":"已启用"}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
      </el-table-column>-->
    </el-table>

    <!-- 回到顶部 -->
    <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="100">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >回到顶部</div>
    </el-backtop>

    <!--分页条-->
    <el-col :span="24" style="text-align:center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:20px"
      ></el-pagination>
    </el-col>

    <!--单条记录编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editForm.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="url">
          <el-tooltip class="item" effect="dark" content="例如：/sample/01" placement="top-start">
            <el-input v-model="editForm.url" auto-complete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="editForm.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-select v-model="editForm.Enabled" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.Name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="editForm.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="isShow" label="是否显示" width sortable>
          <el-switch v-model="editForm.isShow"></el-switch>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="parentId" label="父级菜单" width sortable>
          <el-cascader
            style="width: 400px"
            v-model="editForm.parentId"
            :options="options"
            filterable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.Name" auto-complete="off" placeholder="请输入菜单名称" maxlength="8" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="url">
          <el-tooltip class="item" effect="dark" content="例如：/sample/01" placement="top-start">
            <el-input v-model="addForm.url" auto-complete="off" placeholder="请输入 url 地址" maxlength="30" show-word-limit></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="启用菜单" prop="enable">
          <el-tooltip class="item" effect="dark" content="当选择不启用时，菜单会显示，但是点击无效" placement="top-start">
          <el-switch v-model="addForm.enable"></el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-tooltip class="item" effect="dark" content="值越小排的越前，最小为1，最大为10" placement="top-start">
            <el-input-number v-model="addForm.sort" :min="1" :max="10" label="排序值" size="small"></el-input-number>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="isShow" label="显示菜单" width sortable>
          <el-switch v-model="addForm.isShow"></el-switch>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <e-icon-picker v-model="addForm.icon" placeholder="请选择图标"/>
          <el-input v-model="addForm.icon" placeholder="请输入图标" maxlength="30" show-word-limit auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="parentId" label="父级菜单" width sortable>
          <el-cascader
            style="width: 400px"
            v-model="addForm.parentId"
            :options="options"
            filterable
            change-on-select
            placeholder="请选择父级菜单，如果是顶级菜单，请置为空"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="addForm.desc"
            type="textarea"
            placeholder="请输入菜单描述"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { api } from '@/global/api'
import { _post } from '@/util/axiosRequest'

export default {
  data () {
    return {
      buttonList: [],
      currentRow: null,
      options: [],
      filters: {
        Name: ''
      },
      users: [],
      modules: [], // 接口api列表
      statusList: [
        { Name: '已启用', value: true },
        { Name: '已禁用', value: false }
      ], // 绑定 enable对应的两种状态
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], // 列表选中列

      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,

      editFormRules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
      },
      addFormRules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
      },

      addFormVisible: false, // 新增界面是否显示
      addLoading: false, // 提交添加时显示 loading 动画
      // 新增界面数据
      addForm: {
        parentId: 0,
        name: '',
        icon: '',
        sort: 0,
        isShow: true,
        url: '',
        desc: '',
        enable: true
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        parentId: 0,
        sort: 0,
        icon: '',
        isShow: true,
        name: '',
        url: '',
        desc: '',
        enable: true
      },

      searchType: '', // 搜索框搜索类型
      searchContent: '' // 搜索框输入的内容
    }
  },
  methods: {
    /** 选中了某一行 */
    selectCurrentRow (val) {
      this.currentRow = val
    },
    // 显示转换
    formatEnabled: function (row, column) {
      return row.Enabled ? '正常' : '未知'
    },
    /** 格式化创建时间 */
    formatCreateTime: function (row, column) {

    },
    search () {
      const h = this.$createElement

      this.$notify({
        title: '通知',
        message: h(
          'i',
          { style: 'color: teal' },
          '你点击了搜索，搜索类型为：' +
            this.searchType +
            '搜索内容为：' +
            this.searchContent
        )
      })
    },
    /** 页码改变 */
    handleCurrentChange (val) {
      this.page = val
      this.getPermissions()
    },
    /** 每页显示数量修改 */
    handleSizeChange (val) {},
    /** 加载菜单树 */
    load (tree, treeNode, resolve) {

    },
    // 获取用户列表
    getPermissions () {
    },
    // 删除
    handleDel () {
      const row = this.currentRow
      if (!row) {
        this.$message({
          message: '请选择要删除的一行数据！',
          type: 'error'
        })

        return
      }
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {

        })
        .catch(() => {})
    },
    // 显示编辑界面
    handleEdit () {
      const row = this.currentRow
      if (!row) {
        this.$message({
          message: '请选择要编辑的一行数据！',
          type: 'error'
        })

        return
      }
      const that = this
      that.editLoading = true

      this.editFormVisible = true
      this.editForm = {}

      this.options = []
    },
    // 显示新增界面
    handleAdd () {

    },
    /** 提交添加请求 */
    addSubmit () {
      this.addLoading = true
      _post(api.addMenu,
        {
          name: this.addForm.name,
          parentId: this.addForm.parentId,
          icon: this.addForm.icon,
          sort: this.addForm.sort,
          isShow: this.addForm.isShow,
          url: this.addForm.url,
          desc: this.addForm.desc,
          enable: this.addForm.enable
        },
        data => {
          this.addLoading = false
        }, fail => {
          this.addLoading = false
        })
    },
    // 编辑
    editSubmit: function () {
    },
    /** 显示添加表单 */
    showAddNewForm () {
      this.addFormVisible = true
    },
    /** 显示批量编辑表单 */
    showBulkEdit () {},
    /** 批量删除 */
    bulkRemove () {},
    /** 单元格修改 */
    selsChange: function (sels) {
      this.sels = sels
    },
    // 批量删除
    batchRemove: function () {
      this.$message({
        message: '该功能未开放',
        type: 'warning'
      })
    }
  },
  /** 页面初始化完成后 */
  mounted () {
    // this.getPermissions();
    // getModuleListPage().then((res) => {
    //     this.modules = res.data.response.data;
    // });
    // let routers = window.localStorage.router
    // ? JSON.parse(window.localStorage.router)
    // : [];
    // this.buttonList = getButtonList(this.$route.path, routers);
  }
}
</script>

<style lang="less" scoped>
.toolbar {
  margin-top: 10px;
  margin-bottom: 20px;

  .searchBox {
    width: 500px;
  }
}
</style>
