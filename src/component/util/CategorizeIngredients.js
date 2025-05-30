export const CategorizeIngredients = (ingredients) => {
    // console.log("CategorizeIngredients ", ingredients)
    return ingredients.reduce((acc, ingredient) => {
        const { category } = ingredient;
        if (!acc[category.name]) {
            acc[category.name] = [];
        }

        acc[category.name].push(ingredient);
        return acc;

    }, {})
}