const form = document.querySelector('form');
const output = document.querySelector('main .output');

form.onsubmit = async (ev) => {
    ev.preventDefault();
    output.textContent = "Generating...";

    const data = new FormData(form);
    const userPrompt = data.get('prompt');
    const imageName = data.get('chosenImage');

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userPrompt: userPrompt,
                image: imageName,
            }),
        });

        // Manejo de respuestas de error del servidor (e.g., 400, 403, 500)
        if (!response.ok) {
            // Intenta leer el mensaje de error del cuerpo de la respuesta
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const markdownResponse = await response.text();

        // Renderizar el markdown
        const md = window.markdownit();
        output.innerHTML = md.render(markdownResponse);

    } catch (error) {
        console.error("An error occurred:", error);
        // Muestra un mensaje de error claro al usuario
        output.textContent = `An error occurred while generating the recipe. Please check the console for details or try again later.`;
        if (error instanceof Error) {
            output.textContent += `\nDetails: ${error.message}`;
        }
    }
    
    return false;
};