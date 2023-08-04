export const updateTaskData = errorHandler(async (updatedData: any) => {
    const res = await fetch("/api/task", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });
    return await res.json();
});

function errorHandler(func: Function) {
    return async (...args: any[]) => {
        try {
            return await func(...args);
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };
}
