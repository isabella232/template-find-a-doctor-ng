import { Component } from "@angular/core";
import { isAndroid } from "platform";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view";
import { ad as androidUtils } from "tns-core-modules/utils/utils";

@Component({
    selector: "RootComponent",
    moduleId: module.id,
    templateUrl: "./root.component.html",
    styleUrls: ["./root-common.css"]
})
export class RootComponent {
    title: string; 
    tabSelectedIndex: number;

    getIconSource(icon: string): string {
        return isAndroid ? "res://" + icon : "res://tabIcons/" + icon;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        this.tabSelectedIndex = args.newIndex;
        const tabView = <TabView>args.object;
        const selectedTabViewItem = tabView.items[args.newIndex];

        this.title = selectedTabViewItem.title;
    }

    public tabViewLoaded(args) {
        // close the keyboard in Android at startup (triggered by the search bar in Calculator tab)
        // TODO: utilize LayoutChange event when available in the official {N} version
        if (isAndroid) {
            let timer = setInterval(() => androidUtils.dismissSoftInput(), 250);
            setTimeout(() => clearInterval(timer), 3000);
        }
    }
}
