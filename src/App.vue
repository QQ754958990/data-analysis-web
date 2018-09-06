<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import url('../static/css/grid.css');

  @media screen and (min-width:900px){
   html{
     font-size: 15px;
   }
  }

  @media screen and (min-width:600px) and (max-width:900px){
    html{
      font-size: 10px;
    }
  }

  @media screen and (max-width:600px){
    html{
      font-size: 5px;
    }
  }

  html,body,#app{
    min-width: 600px;
    height: 100%;
    background-color: #f2f2f2;
    overflow: auto;
  }
</style>
