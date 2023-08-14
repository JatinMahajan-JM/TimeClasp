function errorHandler(func: Function) {
    return async (...args: any[]) => {
        try {
            return await func(...args);
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };
}

export const upsertData = errorHandler(async (updatedData: any) => {
    const res = await fetch("/api/time", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });
    return await res.json();
});