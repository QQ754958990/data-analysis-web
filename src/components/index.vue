<template>
  <section class="index_div_wrap">
    <article v-if="save_data || delete_current || export_current" class="indexWrap_div_hint row">
      <input v-if="save_data" v-model="save_file_name" placeholder="输入文件名"></input>
      <p v-if="save_data" @click.prevent="confirm_save_fn">确认修改</p>

      <input v-if="delete_current" list="exports" v-model="delete_current_name" placeholder="选择文件"></input>
      <p v-if="delete_current" @click.prevent="delete_data_fn">确认删除</p>

      <input v-if="export_current" list="exports" v-model="export_current_name" placeholder="选择文件"></input>
      <p v-if="export_current" @click.prevent="export_data_fn">确认导出</p>

    </article>
    <article v-if="!module_type || add_attr || add_cite" class="indexWrap_div_add row">
      <input v-if="!module_type" list="contents" v-model="module_type" placeholder="首层结构"></input>
      <div v-if="add_attr">
        <textarea v-if="module_type==='object'" v-model="attr_key" placeholder="属性名称"/>
        <textarea v-model="attr_value" :placeholder="module_type==='object'?'属性赋值':'项目赋值'"/>
        <p @click.prevent="affirm_attr_fn">确认信息</p>
      </div>

      <div v-if="add_cite">
        <input list="contents" v-model="cite_type" placeholder="索引类型"/>
        <input v-if="cite_type ==='object'" v-model="cite_key" placeholder="索引名称"></input>
        <p @click.prevent="affirm_cite_fn">确认信息</p>
      </div>
    </article>
    <main class="indexWrap_div_main row">
      <div v-if="module_data && !save_data && !delete_current && !export_current" class="col-2">
        <p v-if="module_type==='object'&&!modify_current" @click.prevent="add_module_fn">新增属性</p>
        <p v-if="module_type==='array'&&!modify_current" @click.prevent="add_module_fn">新增项目</p>
        <p v-if="module_type&&!modify_current" @click.prevent="add_cite_fn">新增索引</p>
        <p v-if="module_type&&!add_attr&&!add_cite" @click.prevent="modify_current_fn">修改当前</p>
      </div>
      <div :class="['wrapMain_div_center',(save_data || delete_current || export_current) || (add_attr || add_cite || modify_current)?'col-10':'col-8',!module_data?'col-12':'next']">
        <textarea v-show="module_data&&!modify_current" v-html="module_data" class="mainCenter_textarea_code" disabled></textarea>
        <textarea v-show="module_data&&modify_current" class="mainCenter_textarea_modify"></textarea>
      </div>
      <div v-if="module_data && !modify_current && !add_attr && !add_cite" class="col-2">
        <!--<p @click.prevent="">导入数据</p>-->
        <p v-if="module_data && !delete_current && !export_current" @click.prevent=" save_data = true;delete_current =false;export_current= false;">保存文件</p>
        <p v-if="module_data_list.length && !save_data && !export_current " @click.prevent="save_data = false;delete_current =true;export_current= false;">删除文件</p>
        <p v-if="module_data_list.length && !save_data && !delete_current" @click.prevent="save_data = false;delete_current =false;export_current= true;">导出文件</p>

        <fieldset v-if="module_data_list.length && !save_data && !delete_current && !export_current ">
          <legend>数据列表</legend>
          <a v-for="(item,index) in module_data_list" :key="index" @click.prevent="show_details_fn(item)">{{item['file_name'] + '.json'}}</a>
        </fieldset>
      </div>
    </main>

    <datalist id="contents">
      <option value="object">对象</option>
      <option value="array">数组</option>
    </datalist>

    <datalist id="exports">
      <option v-for="(item,index) in module_data_list" :value="item['file_name']+ '.json'" :key="index">
        {{item['file_name']+ '.json'}}
      </option>
    </datalist>
  </section>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        export_current: false,
        export_current_name: null,

        modify_current: false,

        delete_current: false,
        delete_current_name: null,

        save_data: false,
        save_file_name: null,

        init_module_type: 'NO',
        module_type: null,
        module_data: null,
        module_data_list: [],

        add_attr: false,
        attr_key: null,
        attr_value: null,
        add_cite: false,
        cite_type: null,
        cite_key: null
      }
    },
    methods: {
      funDownload (content, filename) {
        // 创建隐藏的可下载链接
        var eleLink = document.createElement('a')
        eleLink.download = filename
        eleLink.style.display = 'none'
        // 字符内容转变成blob地址
        var blob = new Blob([content])
        eleLink.href = URL.createObjectURL(blob)
        // 触发点击
        document.body.appendChild(eleLink)
        eleLink.click()
        // 然后移除
        document.body.removeChild(eleLink)
      },
      data_conversion (value_string) {
        let new_value
        try {
          try {
            new_value = eval('(' +
              value_string.toString()
                .replace(/(^\s*)|(\s*$)/g, '') //去掉空格
                .replace(/\n|\r/g, '') //去除回车换行
                .replace(/^\"|\"$/igm, '')
                .replace(/^\'|\'$/igm, '')
              + ')')
          } catch (e) {
            new_value = value_string.toString()
              .replace(/(^\s*)|(\s*$)/g, '') //去掉空格
              .replace(/\n|\r/g, '') //去除回车换行
          }
        } catch (e) {
          alert('赋值失败')
          new_value = null
          console.error(e)
        }

        return new_value

      },
      clear_fn () {
        this.attr_key = null
        this.attr_value = null
        this.add_attr = false

        this.cite_type = null
        this.cite_key = null
        this.add_cite = false
      },
      add_module_fn () {
        this.clear_fn()
        this.add_attr = true
      },
      add_cite_fn () {
        this.clear_fn()
        this.add_cite = true
      },
      affirm_attr_fn () {
        let new_value = this.data_conversion(this.attr_value)
        if (new_value === null) {
          this.add_attr = false
          return
        }

        switch (this.module_type) {
          case 'object':
            this.$set(this.module_data, this.data_conversion(this.attr_key), new_value)
            break
          case 'array':
            this.module_data.push(new_value)
            break
        }
        this.clear_fn()

      },
      affirm_cite_fn () {
        try {
          if (this.cite_type === 'object') {
            let new_obj = {}
            new_obj[this.cite_key.toString()] = Object.assign({}, this.module_data)
            this.module_data = new_obj

            this.module_type = 'object'
          } else {
            let new_array = [this.module_data]
            this.module_data = new_array

            this.module_type = 'array'
          }

          this.clear_fn()
        } catch (e) {
          this.add_cite = false
          alert('索引失败')
          console.error(e)
        }
      },
      confirm_save_fn () {
        const _self = this
        const send_data = {
          file_name: _self.save_file_name,
          save_data: _self.module_data
        }
        this.$http.post('/save_data', send_data).then(function (result) {
          _self.get_list_fn()
          _self.save_data = false
          alert('数据更新成功')
        })
      },
      modify_current_fn (e) {
        const code_element = document.getElementsByClassName('mainCenter_textarea_code')[0]
        const modify_element = document.getElementsByClassName('mainCenter_textarea_modify')[0]

        if (e.currentTarget.textContent === '修改当前') {
          modify_element.value = code_element.textContent

          this.modify_current = true
          e.currentTarget.textContent = '保存修改'
        } else {
          let modify_code = this.data_conversion(modify_element.value)
          if (typeof(modify_code) === 'string') return alert('赋值失败')

          if (modify_code.length >= 0) {
            this.module_data = modify_code
            this.module_type = 'array'
          } else {
            for (let key in modify_code) {
              if (modify_code.hasOwnProperty(key)) {
                this.$set(this.module_data, key, modify_code[key])
              }
            }

            this.module_type = 'object'
          }

          this.modify_current = false
          e.currentTarget.textContent = '修改当前'
        }
      },
      show_details_fn (item) {
        this.save_file_name = item['file_name']
        this.module_data = item['save_data']
        this.module_type = 'object'
      },
      get_list_fn () {
        const _self = this
        if (localStorage.token) {
          this.$http.post('/data_list', {}).then(function (result) {
            _self.module_data_list = []
            result.data.content.forEach(function (item) {
              _self.module_data_list.push(item)
            })
          })
        }
      },
      export_data_fn () {
        const _self = this
        this.module_data_list.forEach(function (item) {
          if (item['file_name'] === _self.export_current_name.replace('.json', '')) {
            _self.funDownload(JSON.stringify(item['save_data']), _self.export_current_name)
            _self.export_current = false
            return true
          }
        })
      },
      delete_data_fn () {
        const _self = this
        const file_name = _self.delete_current_name.replace('.json', '')
        this.module_data_list.forEach(function (item,index) {
          if (file_name === item['file_name']) {
            _self.$http.post('./delete_data', {file_name: file_name}).then(function (result) {
              _self.module_data_list.splice(index,1)
              _self.delete_current_name = null
              _self.delete_current = false
            })
            return true
          }
        })
      }
    },
    watch: {
      module_type (new_value) {
        if (this.module_data === null) {
          if (this.init_module_type === 'NO') {
            switch (new_value) {
              case 'object':
                this.module_data = {}
                break
              case 'array':
                this.module_data = []
                break
            }
            this.init_module_type = 'YES'
          }
        }
      }
    },
    mounted () {
      this.get_list_fn()
    }
  }
</script>

<style lang="scss" scoped>
  section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: bold;
    font-size: 1.5rem;
    background-color: #2c3e50;
    color: white;
    * {
      border-radius: 5px;
    }
    .indexWrap_div_hint {
      position: absolute;
      top: 16%;
      border: thin solid white;
      padding: 0.5rem;
      background-color: cornflowerblue;
      * {
        border: thin solid white;
        margin: 0.1rem;
        text-align: center;
      }
    }
    .indexWrap_div_add {
      position: absolute;
      top: 16%;
      border: thin solid white;
      padding: 0.5rem;
      background-color: cornflowerblue;
      & > input {
        border: thin solid white;
        margin: 0.1rem;
      }
      & > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        textarea {
          height: 10rem;
          border: thin solid white;
          margin: 0.1rem;
        }
        p {
          width: 98%;
          border: thin solid white;
          text-align: center;
        }
      }
    }
    main {
      width: 96%;
      height: 96%;
      & > div {
        height: 100%;
        padding: 1.2rem;
        border: thin solid white;
      }
      .wrapMain_div_center {
        textarea {
          width: 100%;
          height: 100%;
          padding: 1rem;
          background-color: inherit;
          color: wheat;
        }
        .mainCenter_textarea_modify {
          background-color: white;
          color: black;
        }
        p {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .col-2 {
        p {
          border: thin solid white;
          text-align: center;
        }
      }
      fieldset {
        margin-top: 1rem;
        text-align: center;
        border: thin solid wheat;
        legend {
          font-size: 1rem;
          text-align: left;
          color: white;
        }
        a {
          display: block;
          color: wheat;
        }
      }
    }
  }
</style>
