<template>
	<div class="footer">
		<h2>Bienvenue sur le p7 OpenClassRooms</h2>
		<nav class="footer-list">
			<li><a href="societe.com">Qui sommes nous</a></li>
			<li><a href="https://www.talentprogram.fr/valeurs-entreprise/">Nos Valeurs</a></li>
			<li><a href="https://openclassrooms.com/fr/">Nous Contacter</a></li>
		</nav>
	</div>
</template>

<script>
export default {
	name: "Footer",
};
</script>

<style scoped lang="scss">
.footer {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: auto;
	margin-bottom: 40px;
}
.footer-list {
	display: flex;
	list-style: none;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-evenly;
	align-items: center;
}

a {
	font-weight: bold;
	color: #2c3e50;
	&.router-link-exact-active {
		color: #fd2d01;
	}
}
a:hover {
	color: #fd2d01;
}
li:hover {
	transform: scale(1.2);
	transition: 0.2s;
}
</style>
