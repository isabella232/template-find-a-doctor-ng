import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { LoggedInLazyLoadGuard } from "./logged-in-lazy-load.guard";

const routes: Routes = [
    { path: "", redirectTo: "/root", pathMatch: "full" },
    { path: "root", loadChildren: "./root/root.module#RootModule", canLoad: [LoggedInLazyLoadGuard] },
    { path: "search", loadChildren: "./search/search.module#SearchModule", canLoad: [LoggedInLazyLoadGuard] },
    { path: "plan", loadChildren: "./plan/plan.module#PlanModule", canLoad: [LoggedInLazyLoadGuard] },
    { path: "results", loadChildren: "./results/results.module#ResultsModule", canLoad: [LoggedInLazyLoadGuard] },
    { path: "login", loadChildren: "./login/login.module#LoginModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
