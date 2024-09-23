import axios from 'axios';

export const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // Подробная информация об ошибке Axios
    console.error('Axios error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      config: error.config,
      response: error.response
        ? {
            data: error.response.data.errors,
            status: error.response.status,
            headers: error.response.headers,
          }
        : null,
    });
  } else {
    // Общая информация об ошибке
    console.error('Error:', error);
  }
  throw error;
};
