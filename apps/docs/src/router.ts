import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import RecipesView from "./views/RecipesView.vue";
import RecipeDetailView from "./views/RecipeDetailView.vue";
import InstallationView from "./views/InstallationView.vue";
import AdminEmptyStatesView from "./views/examples/AdminEmptyStatesView.vue";
import PermissionsAndUpgradeView from "./views/examples/PermissionsAndUpgradeView.vue";
import TaskFlowView from "./views/examples/TaskFlowView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/recipes", component: RecipesView },
    { path: "/recipes/:slug", component: RecipeDetailView },
    { path: "/blocks", redirect: "/recipes" },
    {
      path: "/blocks/:slug",
      redirect: (to) => `/recipes/${String(to.params.slug ?? "")}`,
    },
    { path: "/docs/installation", component: InstallationView },
    { path: "/examples/admin-empty-states", component: AdminEmptyStatesView },
    {
      path: "/examples/permissions-and-upgrade",
      component: PermissionsAndUpgradeView,
    },
    { path: "/examples/task-flow", component: TaskFlowView },
  ],
});
