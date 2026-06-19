<template>
	<view class="status_bar" :class="[classname]">
		<!-- 这里是状态栏 -->
	</view>
</template>

<script>
export default {
	data () {
		return {

		}
	},
	props: {
		classname: {
			type: String,
			default: ''
		}
	},
	methods: {

	}
}
</script>

<style lang="scss" scoped>
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
</style>