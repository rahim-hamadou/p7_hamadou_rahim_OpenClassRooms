<template>
	<main class="main main--connect">
		<form class="w-75 align-items-center form-block  center-home shadow rounded">
			<div
				class="form-block--left d-flex flex-column justify-content-center block-demi-container p-3 text-right align-self-stretch"
			>
				<img class="logo align-self-end" src="../assets/icon.svg" alt="Logo Groupomania" />
				<div class="center-element">
					<small>
						<span> Vous n'avez pas encore de compte,</span>
						<router-link class="redirection-singup " to="/signup">enregistrez-vous</router-link>
					</small>
				</div>
			</div>
			<div class="block-demi-container p-3 align-element ">
				<div class="form-group">
					<label for="inputUsername">Username</label>
					<input type="text" class="form-control" id="inputUsername" v-model="dataLogin.username" />
				</div>

				<div class="form-group">
					<label for="inputPassword">Password</label>
					<input type="password" class="form-control" id="inputPassword" v-model="dataLogin.password" />
				</div>
				<button @click.prevent="logIn" type="submit" class="btn btn-primary">Soumettre</button>
			</div>
		</form>
	</main>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
	name: "SignUp",
	data() {
		return {
			dataLogin: {
				username: null,
				password: null,
			},
			msg: "",
		};
	},
	computed: {
		...mapState(["user"]),
	},
	methods: {
		logIn() {
			if (
				//TO DO : Vérifier par Regex
				this.dataLogin.username !== null ||
				this.dataLogin.password !== null
			) {
				axios
					.post("http://localhost:3000/api/user/login", this.dataLogin)
					.then((response) => {
						localStorage.setItem("token", response.data.token);
						location.replace(location.origin);
					})
					.catch((error) => {
						console.log(error);
						alert("Connexion impossible , veuillez verifier les identifiants");
					});
			} else {
				console.log("oops !");
			}
		},
	},
};
</script>

<style lang="scss">
.center-element {
	margin: auto;
}
.center-home {
	margin: 150px auto;
}
</style>
