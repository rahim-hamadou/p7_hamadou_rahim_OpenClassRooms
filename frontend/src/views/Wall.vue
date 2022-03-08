<template>
	<div id="wall" class="wall">
		<!-- logo de l'app -->
		<!-- <div class="logo-home">
			<img src="../assets/icon-above-font.png" />
		</div> -->
		<CreatePost />

		<Post v-for="post in allPosts" v-bind:key="post.id" :post="post" @infosPost="setInfos" />
		<modalBoxModerate :post="post" />
	</div>
</template>

<script>
// pour l'appel au backend
import axios from "axios";
// pour l'appel aux components
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import modalBoxModerate from "../components/ModifPost";

export default {
	name: "Mur",
	components: {
		CreatePost,
		Post,
		modalBoxModerate,
	},
	data() {
		return {
			post: {
				id: "",
				content: "",
				image: "",
			},
			//affichePsts: true,
			//afficheFrm: false,
			allPosts: [],
			//allComments: [],
			//postId: "",
			//nbCom: []
		};
	},
	methods: {
		setInfos(payload) {
			this.post = payload.post;
		},
	},
	// a la creation  de la page
	mounted() {
		axios
			.get("http://localhost:3000/api/post", {
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			})
			//.get("http://localhost:3000/api/post",this.$store.state.headerParams)
			// on recupere et defini un objet qui represente la data de la reponse
			.then((response) => {
				console.log("post", response.data);
				this.allPosts = response.data;
			})
			.catch((error) => {
				console.log(error); //affiche pas le message 'normalement' envoyé par le back
			}),
			/*axios.get("http://localhost:3000/api/posts/comments")
                .then(response => {
                    this.nbCom=response.data;
                    console.log(this.nbCom);
                })
                .catch(error => {
                console.log(error);
                });*/
			this.$store.dispatch("getUserInfos");
	},
};
</script>

<style lang="scss">
.wall {
	background-color: #e77810bf;
	min-height: 100%;
	padding: 5rem 0 2rem 0;
	margin-top: 150px;
}
.block-post {
	background-color: #e0d2c5;
	width: 85%;
	margin: auto;
	box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.25);
	border-radius: 0.25rem;
	padding: 0.5rem;
	margin-bottom: 1rem;
	& h3 {
		color: grey;
		margin: 0.25rem 0;
		font-size: 0.75rem;
	}
	& .like-section {
		& div {
			display: inline-block;
			margin: 0 0.5rem;
			& i {
				margin: 0 0.2rem;
			}
			& a {
				text-decoration: none;
				color: grey;
			}
		}
		font-weight: 700;
		color: grey;
	}

	@media (max-width: 490px) {
		.custom-file label {
			color: hsla(0, 0%, 0%, 0);
		}
	}
}
</style>
