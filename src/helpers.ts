export function parseDate(dateStr: string): Date {
    const parts = dateStr.split(/\D+/).map(p => parseInt(p, 10));
    if (parts.length < 2 || parts.some(isNaN)) {
        return new Date(dateStr); // Возврат к старому поведению, если формат неожиданный
    }

    const n1 = parts[0];
    const n2 = parts[1];

    const n1IsMonth = n1 >= 1 && n1 <= 12;
    const n2IsMonth = n2 >= 1 && n2 <= 12;

    let day: number, month: number;

    if (n2IsMonth && !n1IsMonth) { // Например, 27/10
        day = n1;
        month = n2;
    } else if (n1IsMonth && !n2IsMonth) { // Например, 10/27
        day = n2;
        month = n1;
    } else { // Если оба могут быть месяцем (e.g. 10/11) или оба не могут, считаем, что первое - день
        day = n1;
        month = n2;
    }

    // Год не указан, используем текущий
    return new Date(new Date().getFullYear(), month - 1, day);
}