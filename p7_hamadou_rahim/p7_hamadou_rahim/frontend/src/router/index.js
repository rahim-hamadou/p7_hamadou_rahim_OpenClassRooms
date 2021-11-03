import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Profil from "../views/Profil.vue";
import Forum from "../views/Forum.vue";
import ForumID from "../views/ForumId.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/Forum",
		name: "Forum",
		component: Forum,
		// component: () => import(/* webpackChunkName: "about" */ "../views/Forum.vue"),
	},
	{
		path: "/ForumId",
		name: "ForumId",
		component: ForumID,
		// component: () => import(/* webpackChunkName: "about" */ "../views/ForumID.vue"),
	},
	{
		path: "/Signup",
		name: "Signup",
		component: Signup,
		// component: () => import(/* webpackChunkName: "about" */ "../views/Signup.vue"),
	},
	{
		path: "/Login",
		name: "Login",
		component: Login,
		// component: () => import(/* webpackChunkName: "about" */ "../views/Login.vue"),
	},

	{
		path: "/Profil",
		name: "Profil",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: Profil,
		// component: () => import(/* webpackChunkName: "about" */ "../views/Profil.vue"),
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
