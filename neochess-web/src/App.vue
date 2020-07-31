<template>
<div id="app" class="medium-container">
	<router-view/>
</div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
export default {
	name: "App"
}
</script>

<style lang="scss">
body {
	color: #ffffff;
	background-color: #1D1D1D;
}
p {
	margin-bottom: 0%;
}
.spacing-top {
	margin-top: 1.5em;
}
#app {
	margin-top: 1em;
	display: block;
	text-align: center;
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.align-left {
	text-align: left;
}
.neochess-title {
	font-weight: bold;
}
.center {
  margin: auto;
  width: 50%;
}
.medium-container {
	max-width: 1200px;
}
.neochess-modal {
	background-color: #1D1D1D;
	width: 100%;
	height: 100%;
}
.bv-example-row {
	height: 100%;
}
.center {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200px;
	border: 3px solid green;
}
.round-corners {
	border-radius: 15px 15px 15px 15px;
}
</style>