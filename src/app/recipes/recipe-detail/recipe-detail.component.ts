import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
recipe: Recipe;
id: number;

  constructor(private slService:ShoppingListService,
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getARecipe(this.id);
      }
    );
  }

  sendtoSL(){
    //this.recipe.ingredients.forEach(this.slService.addIngredient) --> this forEach loop doesn't work...
    
    //disadvantage of below: emits ingredientsChanged event for each ingredient added
    /* for (let el of this.recipe.ingredients){
      this.slService.addIngredient(el);
    } */

    this.slService.addIngredients(this.recipe.ingredients)
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route});

    //same thing, just using this.id
    //this.router.navigate(['../',this.id, 'edit'], {relativeTo: this.route});
  }
  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
