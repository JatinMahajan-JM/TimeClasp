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

export const addNewTask = errorHandler(async (formData: any) => {
    const res = await fetch("/api/task/addNewTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    return await res.json();
})

export const updateRepeated = errorHandler(async (formData: any) => {
    const res = await fetch("/api/task/updateRepeated", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    return await res.json();
})

export const updateSubTask = errorHandler(async (formData: any) => {
    const res = await fetch("/api/task/updateSubTask", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    return await res.json();
})

export const deleteById = errorHandler(async (formData: any) => {
    const res = await fetch("/api/task/deleteById", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    return await res.json();
})


function errorHandler(func: Function) {
    return async (...args: any[]) => {
        try {
            return await func(...args);
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };
}
