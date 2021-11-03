<template>
	<!-- <div id="nav"> -->
	<div>
		<router-link to="/">Home</router-link> | <router-link to="/Forum">Forum</router-link> |
		<router-link to="/Profil">Profil</router-link> | <router-link to="/ForumId">Mon fil</router-link> |
		<router-link to="/login">Se connecter</router-link> |
		<router-link to="/Signup">S'enregistrer</router-link>
	</div>

	<!-- <h1>Bienvenue sur le p7 OpenClassRooms</h1> -->
	<router-view />
</template>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
a {
	font-weight: bold;
	color: #fd2d01;
}
a:active {
	text-decoration: none;
}
</style>
