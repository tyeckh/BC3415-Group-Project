// OpenAI API configuration
const OPENAI_API_KEY = 'YOUR_API_KEY';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

document.getElementById('generateButton').addEventListener('click', generateRecipes);

async function generateRecipes() {
    const ingredients = document.getElementById('ingredientInput').value;
    const outputDiv = document.getElementById('recipeOutput');
    
    outputDiv.innerHTML = '<p>Generating recipes...</p>';
    
    try {
        const recipes = await getAIGeneratedRecipes(ingredients);
        displayRecipes(recipes);
    } catch (error) {
        outputDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

async function getAIGeneratedRecipes(ingredients) {
    const prompt = `Generate 3 recipe ideas using the following ingredients: ${ingredients}. For each recipe, provide a title, list of ingredients, cooking instructions, and basic nutritional information.`;

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 2000,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate recipes');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

function displayRecipes(recipes) {
    const outputDiv = document.getElementById('recipeOutput');
    outputDiv.innerHTML = `
        <h2>Generated Recipes</h2>
        <pre>${recipes}</pre>
    `;
}
