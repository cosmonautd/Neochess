<template>
<div id="app" :class="this.$vssWidth >= 992 ? 'medium-container' : ''">
	<router-view/>
</div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueScreenSize from 'vue-screen-size'
export default {
	name: "App",
	mixins: [VueScreenSize.VueScreenSizeMixin],
}
</script>

<style lang="scss">
h1 {
	color: #0366ee
}
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
.round-corners {
	border-radius: 15px 15px 15px 15px;
}
.vertical-spacing-1 {
	height: 1em;
}
.vertical-spacing-2 {
	height: 2em;
}
.vertical-spacing-3 {
	height: 3em;
}
.vertical-spacing-4 {
	height: 4em;
}
.vertical-spacing-8 {
	height: 8em;
}
.unselectable a, p, h1, div {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
// button {
// 	background-color: #5489B1;
// 	border-color: #5489B1;
// }

/* Make scroll bars invisible */

html {
    scrollbar-width: none; /* For Firefox */
    -ms-overflow-style: none; /* For Internet Explorer and Edge */
}

html::-webkit-scrollbar {
    width: 0px; /* For Chrome, Safari, and Opera */
}
</style>