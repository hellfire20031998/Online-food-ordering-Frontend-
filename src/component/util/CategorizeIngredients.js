export const CategorizeIngredients = (ingredients) => {
    if (!Array.isArray(ingredients)) return {};
    return ingredients.reduce((acc, ingredient) => {
        const categoryName = ingredient.category?.name || "Others";
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(ingredient);
        return acc;
    }, {});
};
