<template>
	<div class="home">
		<Register />
		<Footer />
	</div>
</template>

<script>
// @ is an alias to /src

import Register from "../components/Register";
import Footer from "../components/Footer.vue";

export default {
	name: "Home",
	components: {
		Register,
		Footer,
	},
};
</script>
