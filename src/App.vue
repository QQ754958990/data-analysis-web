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

    html, body, #app {
        height: 100%;
        background-color: #f2f2f2;
        overflow: auto;
    }
</style>
