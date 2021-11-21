import Vue from "vue";
// librairie js servant a la gestion des routes
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Wall",
		component: () => import("../views/Wall.vue"),
		meta: {
			title: "Wall",
		},
	},
	{
		path: "/signup",
		name: "Signup",
		component: () => import("../views/Signup.vue"),
		meta: {
			title: "Signup",
		},
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("../views/Login.vue"),
		meta: {
			title: "Login",
		},
	},
	{
		path: "/user",
		name: "User",
		component: () => import("../views/User.vue"),
		meta: {
			title: "User",
		},
	},
	{
		path: "/:pathMatch(.*)",
		name: "NotFound",
		component: () => import("../views/NotFound.vue"),
		meta: {
			title: " 404 Mauvaise Page",
		},
	},
];

const router = new VueRouter({
	routes,
});

// Ecrire le nom de la page active dans l'onglet de navigation
router.afterEach((to, from) => {
	console.log(from, to);
	document.title = to.meta.title;
});

export default router;
