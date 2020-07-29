<template>
  <div class="hello">
    {{msg}}<br/><br/>
    <el-row>
      <el-button type="primary">登录</el-button>
      <el-button type="primary">取消</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '每一天你所遇见的人，都是别人渴望而不可及的人！'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
