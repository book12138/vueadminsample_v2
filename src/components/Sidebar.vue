<template>
  <div>
    <template v-if="item.children">
      <el-submenu
        v-if="!(item.url!=''&&item.url!=' '&&item.url!='-')&&item.isShow"
        :index="item.id+'index'"
        :key="item.url"
      >
        <template slot="title">
          <i
            v-if="item.children&&item.children.length>0&&item.isShow"
            class="iconfont"
            :class="item.icon"
          ></i>
          <span class="title-name" slot="title">{{item.name}}</span>
        </template>
        <template v-for="child in item.children">
          <!-- 这里实现自己递归嵌套 -->
          <template v-if="child.isShow">
            <sidebar
              v-if="child.children&&child.children.length>0"
              :item="child"
              :index="child.id"
              :key="child.url"
            />
            <el-menu-item v-else :key="child.url" :index="child.url" @click="cop">
              <!-- {{child.name}}2 -->
              <i class="iconfont" :class="child.icon"></i>
              <template slot="title">
                <span class="title-name" slot="title">{{child.name}}</span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </el-submenu>
      <template v-else>
        <el-menu-item v-if="item.isShow" :index="item.url" :key="item.url+'d'">
          <i class="iconfont" :class="item.icon"></i>
          <template slot="title">
            <span class="title-name" slot="title">{{item.name}}</span>
          </template>
        </el-menu-item>
      </template>
    </template>
    <!-- 没有子节点，直接输出 -->
    <template v-else>
      <el-menu-item :index="item.url" :key="item.url+'d'" @click="cop">
        <i class="iconfont" :class="item.icon"></i>
        <template slot="title">
          <span class="title-name" slot="title">{{item.name}}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    cop: function() {
      // 子组件中触发父组件方法collaFa并传值123
      this.$emit("collaFa", "123");
    }
  }
};
</script>
