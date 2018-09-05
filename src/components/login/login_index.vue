<template>
  <section class="login_div_wrap">
    <main class="loginWrap_main">
      <form autocomplete="on">
        <fieldset>
          <legend>登陆信息</legend>
          <label for="user_id">帐号：</label><input id="user_id" v-model="user_id" placeholder="请输入帐号"/>
          <label for="user_password">密码：</label><input type="password" id="user_password" v-model="user_password"
                                                       placeholder="请输入密码"/>
          <button @click.prevent="login_fn">登陆</button>
          <button @click="add_fn">注册</button>
        </fieldset>
      </form>
    </main>
  </section>

</template>

<script>
  import index from '@/router'

  export default {
    name: 'login_index',
    data () {
      return {
        enroll: false,
        user_id: '',
        user_password: ''
      }
    },
    methods: {
      login_fn () {
        const _self = this

        if (!_self.user_id || !_self.user_password) {
          return alert('信息输入错误')
        }

        this.$http.get('/login', {
          params: {
            user_id: _self.user_id,
            user_password: _self.user_password
          }
        }).then(function (result) {
          if (result.data.content.length) {
            localStorage.token = result.data.token
            _self.$router.push({name: 'index'})
          } else {
            alert('找不到该信息')
          }
        })
      },
      add_fn () {
        const _self = this

        if (!_self.user_id || !_self.user_password) {
          return alert('信息输入错误')
        }

        this.$http.get('/add_user', {
          params: {
            user_id: _self.user_id,
            user_password: _self.user_password
          }
        }).then(function (result) {
          _self.user_id = null
          _self.user_password = null
          alert('添加用户完成')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  section {
    height: 100%;
    main {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-size: 1.2rem;
      font-weight: bold;
      background-color: #2c3e50;
      form {
        height: 60%;
        * {
          margin: 0.1rem;
        }
        label, input {
          width: 100%;
          height: 2rem;
          border-radius: 10px;
          text-align: center;
        }
        button {
          width: 20%;
          border: 0;
          border-radius: 5px;
        }
      }
    }
  }
</style>
