/**
 * StateKit ?????
 * 1. ????????
 * 2. ????????????block ???????????????????
 * 3. ????????????????????????????????
 */

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import BlocksView from "./views/BlocksView.vue";
import BlockDetailView from "./views/BlockDetailView.vue";
import InstallationView from "./views/InstallationView.vue";
import AdminEmptyStatesView from "./views/examples/AdminEmptyStatesView.vue";
import PermissionsAndUpgradeView from "./views/examples/PermissionsAndUpgradeView.vue";
import TaskFlowView from "./views/examples/TaskFlowView.vue";
export default createRouter({ history: createWebHistory(), routes: [{ path: "/", component: HomeView }, { path: "/blocks", component: BlocksView }, { path: "/blocks/:slug", component: BlockDetailView }, { path: "/docs/installation", component: InstallationView }, { path: "/examples/admin-empty-states", component: AdminEmptyStatesView }, { path: "/examples/permissions-and-upgrade", component: PermissionsAndUpgradeView }, { path: "/examples/task-flow", component: TaskFlowView }] });
