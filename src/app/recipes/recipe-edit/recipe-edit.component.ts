import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";

import { Store } from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import * as RecipesActions from "../store/recipe.actions";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      // tslint:disable-next-line: no-string-literal
      this.id = +params["id"];
      // tslint:disable-next-line: no-string-literal
      this.editMode = params["id"] != null;
      this.initForm();
    });
  }

  onSubmit() {
    // const method:
    // const newRecipe = new Recipe(
    //   // tslint:disable-next-line: no-string-literal
    //   this.recipeForm.value['name'],
    //   // tslint:disable-next-line: no-string-literal
    //   this.recipeForm.value['description'],
    //   // tslint:disable-next-line: no-string-literal
    //   this.recipeForm.value['imagePath'],
    //   // tslint:disable-next-line: no-string-literal
    //   this.recipeForm.value['ingredients']);
    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(
        new RecipesActions.UpdateRecipe({
          index: this.id,
          newRecipe: this.recipeForm.value,
        })
      );
    } else {
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    // this.router.navigate(["../"], { relativeTo: this.route });
    this.onCancel();
  }

  onAddIngredient() {
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    (<FormArray>this.recipeForm.get("ingredients")).push(
      new FormGroup({
        // tslint:disable-next-line: object-literal-key-quotes
        name: new FormControl(null, Validators.required),
        // tslint:disable-next-line: object-literal-key-quotes
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    (<FormArray>this.recipeForm.get("ingredients")).removeAt(index);
  }

  private initForm() {
    let recipeName = "";
    let recipeImagePath = "";
    let recipeDescription = "";
    // tslint:disable-next-line: prefer-const
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.store
        .select("recipes")
        .pipe(
          map((recipeState) => {
            return recipeState.recipes.find((recipe, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe((recipe) => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          // tslint:disable-next-line: no-string-literal
          if (recipe["ingredients"]) {
            // tslint:disable-next-line: prefer-const
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  // tslint:disable-next-line: object-literal-key-quotes
                  name: new FormControl(ingredient.name, Validators.required),
                  // tslint:disable-next-line: object-literal-key-quotes
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      // tslint:disable-next-line: object-literal-key-quotes
      name: new FormControl(recipeName, Validators.required),
      // tslint:disable-next-line: object-literal-key-quotes
      imagePath: new FormControl(recipeImagePath, Validators.required),
      // tslint:disable-next-line: object-literal-key-quotes
      description: new FormControl(recipeDescription, Validators.required),
      // tslint:disable-next-line: object-literal-key-quotes
      ingredients: recipeIngredients,
    });
  }

  get controls() {
    // a getter!
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    return (<FormArray>this.recipeForm.get("ingredients")).controls;
  }

  ngOnDestroy() {}
}
