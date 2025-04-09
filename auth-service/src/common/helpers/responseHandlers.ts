 export const successResponse =(message: string, data?: any, status_code?: number) =>{
    return {
        status_code: status_code ? status_code : 200,
        message,
        data
    }
}

export const errorResponse =(message: string, data?: any, status_code?: number) =>{
    return {
        status_code: status_code ? status_code : 400,
        message,
        data
    }
}

export const serverErrorResponse = (message: string, data?: any, status_code?: number) => {
    return {
        status_code: status_code ? status_code : 500,
        message,
        data
    }
}