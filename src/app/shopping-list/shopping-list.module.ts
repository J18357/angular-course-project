import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { ListEditComponent } from "./list-edit/list-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ListEditComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: ShoppingListComponent }
        ]),
        SharedModule,
        FormsModule
    ]
}
)
export class ShoppingListModule {}