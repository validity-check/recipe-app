import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { map, tap, take, exhaustMap } from "rxjs/operators";

import { RecipeService } from "../recipes/recipes.service";
import { AuthService } from "../auth/auth.service";

import { Recipe } from "../recipes/recipes.model";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put("https://recipes-app-a004d.firebaseio.com/recipes.json", recipes)
      .subscribe((response) => {});
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>("https://recipes-app-a004d.firebaseio.com/recipes.json")
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
