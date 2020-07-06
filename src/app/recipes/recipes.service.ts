import { Injectable } from "@angular/core";

// import { ShoppingListService } from '../shopping-list/shopping-list.service';

import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipes.model";
import { Subject } from "rxjs/internal/Subject";
import { Store } from "@ngrx/store";

import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import * as fromApp from "../store/app.reducer";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //     new Recipe(
  //         'First recipe',
  //         'Your very first recipe! Edit and begin!',
  //         'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg',
  //         [
  //             new Ingredient('CPH14', 1459693),
  //             new Ingredient('ANZ112', 1280)
  //         ]),

  //     new Recipe(
  //         'Second recipe',
  //         'Your second recipe! Edit and begin!',
  //         'https://live.staticflickr.com/65535/48395479791_61303e495e_n.jpg',
  //         [
  //             new Ingredient('CPH14', 65535),
  //             new Ingredient('ANZ112', 48395479791)
  //         ])];

  private recipes: Recipe[] = [];

  constructor(
    // private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.shoppingListService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
