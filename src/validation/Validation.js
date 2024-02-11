export  const validate = (values) => {
    const errors = {};
    if (!values.email) {
        errors.email = 'E-posta gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Geçersiz e-posta formatı';
    }
    if (!values.password) {
        errors.password = 'Parola gereklidir';
    } else if (values.password.length < 8) {
        errors.password = 'Parola en az 8 karakter olmalı';
    }
    return errors;
};

export const validateTodo = (values) => {
    const errors = {};
    if (!values.title) {
        errors.title = 'Başlık gereklidir';
    }
    if (!values.description) {
        errors.description = 'Açıklama gereklidir';
    }
    return errors;
};