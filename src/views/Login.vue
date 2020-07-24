<template>
  <div class="login-container">
    <ul class="bg-bubbles">
      <li v-for="n in 10" :key="n"></li>
      <ol v-for="m in 5" :key="m"></ol>
    </ul>
    <div class="login-backcolor"></div>
    <div class="login-content">
      <el-form ref="loginForm" :model="form" :rules="rules">
        <el-form-item style="text-align:center">
          <img style="height:80px;margin:auto" src="@/assets/logo.png" />
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            type="text"
            placeholder="请输入用户名"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请输入密码"
            v-model="form.password"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-switch
            class="fl_left"
            style="margin-top:10px;margin-right:5px;"
            v-model="form.rememeberme"
            active-color="#13ce66"
            inactive-color="#c8c8c8"
          ></el-switch>
          <span class="fl_left" style="color:#909399">记住密码</span>
          <a class="fl_right" style="color:#2D83E4">忘记密码？</a>
          <div class="clr"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" v-on:click="onSubmit('loginForm')">登录</el-button>
        </el-form-item>

        <!-- <el-form-item label="社交账号登录">
          <img class="fl_left" style="height:25px;margin-top:8px;" src="@/assets/icon/qq.png" />
          <span class="fl_right" style="margin-right:10px;color:#2D83E4" @click="cut">注册账号</span>
        </el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>
import { api } from '@/global/api'
import { _post } from '@/util/axiosRequest'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Login',
  data: function () {
    return {
      form: {
        email: '',
        password: '',
        rememeberme: false
      },

      rules: {
        // 表单验证，需要在 el-form-item 元素中增加 prop 属性
        username: [
          { required: true, message: '用户名不可为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不可为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters('global', ['routeRedirectTarget'])
  },
  methods: {
    ...mapActions('global', ['setToken']),
    onSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const h = this.$createElement
          this.$notify({
            title: '登录通知',
            message: h(
              'i',
              { style: 'color: teal' },
              '信息验证通过，即将进行服务端请求'
            )
          })

          _post(
            api.login,
            {
              Name: this.form.username,
              Password: this.form.password
            },
            succRes => {
              this.$notify({
                title: '登录通知',
                message: h('i', { style: 'color: teal' }, '后台已成功响应')
              })

              console.log(succRes)
              if (succRes.isSuccess) {
                this.$notify({
                  title: '登录通知',
                  message: h(
                    'i',
                    { style: 'color: teal' },
                    '成功获取token，有效期为两个小时，3秒后将进行跳转'
                  )
                })

                console.log(this.routeRedirectTarget)
                console.log('准备存储token')
                // this.setToken(succRes.token); //存储token
                this.$store.commit('global/setToken', succRes.token) // 存储token，这个是无奈中选择的一种办法，上面那种写法，会在actions中丢失，执行不到mutations中方法
                console.log('准备好设置定时器跳转')
                setTimeout(() => {
                  this.$router.push({ path: this.routeRedirectTarget === '/login' ? '/' : this.routeRedirectTarget })
                }, 3000)
              } else {
                this.$alert(`<strong>${succRes.message}</strong>`, '登录通知', {
                  dangerouslyUseHTMLString: true
                })
              }
            },
            failRes => {
              console.log('登录失败')
            }
          )
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@loginContentWidth: 320px;
@loginContentHeight: 450px;

.login-container {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
  background: url(../assets/loginbck.png) no-repeat top left;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  margin:0px;
  padding:0px;
  top:0px;
  left:0px;

  .login-backcolor {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 4;
    background: #50a3a2;
    background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
    background: linear-gradient(to bottom right, #127c7b 0, #50a3a2);
    opacity: 0.8;
  }

  .login-content {
    position: absolute;
    z-index: 5;
    width: @loginContentWidth;
    height: @loginContentHeight;
    top: calc(40% - @loginContentHeight / 2);
    left: calc(50% - @loginContentWidth / 2);
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px 20px;
    border-radius: 10px;
  }

  .bg-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .bg-bubbles li,
  .bg-bubbles ol {
    position: absolute;
    list-style: none;
    display: block;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.15);
    bottom: -160px;
    -webkit-animation: square 25s infinite;
    animation: square 25s infinite;
    -webkit-transition-timing-function: linear;
    transition-timing-function: linear;
  }

  ol {
    padding: 0 !important;
  }

  .bg-bubbles ol:nth-child(11) {
    left: 10%;
    top: 10%;
    width: 20px;
    height: 20px;
  }

  .bg-bubbles ol:nth-child(12) {
    left: 20%;
    top: 40%;

    width: 60px;
    height: 60px;
  }

  .bg-bubbles ol:nth-child(13) {
    left: 65%;
    top: 30%;

    width: 100px;
    height: 60px;
  }

  .bg-bubbles ol:nth-child(14) {
    left: 70%;
    top: 30%;
    width: 100px;
    height: 150px;
  }

  .bg-bubbles ol:nth-child(15) {
    left: 50%;
    top: 70%;

    width: 40px;
    height: 60px;
  }

  .bg-bubbles li:nth-child(1) {
    left: 10%;
  }

  .bg-bubbles li:nth-child(2) {
    left: 20%;
    width: 80px;
    height: 80px;
    -webkit-animation-delay: 2s;
    animation-delay: 2s;
    -webkit-animation-duration: 17s;
    animation-duration: 17s;
  }

  .bg-bubbles li:nth-child(3) {
    left: 25%;
    -webkit-animation-delay: 4s;
    animation-delay: 4s;
  }

  .bg-bubbles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    -webkit-animation-duration: 22s;
    animation-duration: 22s;
    background-color: rgba(255, 255, 255, 0.25);
  }

  .bg-bubbles li:nth-child(5) {
    left: 70%;
  }

  .bg-bubbles li:nth-child(6) {
    left: 80%;
    width: 120px;
    height: 120px;
    -webkit-animation-delay: 3s;
    animation-delay: 3s;
    background-color: rgba(255, 255, 255, 0.2);
  }

  .bg-bubbles li:nth-child(7) {
    left: 32%;
    width: 160px;
    height: 160px;
    -webkit-animation-delay: 7s;
    animation-delay: 7s;
  }

  .bg-bubbles li:nth-child(8) {
    left: 55%;
    width: 20px;
    height: 20px;
    -webkit-animation-delay: 15s;
    animation-delay: 15s;
    -webkit-animation-duration: 40s;
    animation-duration: 40s;
  }

  .bg-bubbles li:nth-child(9) {
    left: 25%;
    width: 10px;
    height: 10px;
    -webkit-animation-delay: 2s;
    animation-delay: 2s;
    -webkit-animation-duration: 40s;
    animation-duration: 40s;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .bg-bubbles li:nth-child(10) {
    left: 90%;
    width: 160px;
    height: 160px;
    -webkit-animation-delay: 11s;
    animation-delay: 11s;
  }

  @-webkit-keyframes square {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    100% {
      -webkit-transform: translateY(-700px) rotate(600deg);
      transform: translateY(-700px) rotate(600deg);
    }
  }

  @keyframes square {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    100% {
      -webkit-transform: translateY(-700px) rotate(600deg);
      transform: translateY(-700px) rotate(600deg);
    }
  }
}
</style>
