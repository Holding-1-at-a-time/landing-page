export const saveToConvex = async (data: Record<string, FormDataEntryValue>) => {
    console.log("Saving to Convex:", data);
    const response = await fetch("/api/convex", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return (await response.json()) as { success: boolean; message: string };
};