import * as fs from "fs";
import { Lesson } from "./types";

/**
 * Парсит текстовый файл с утренними активностями и преобразует его
 * в массив дней, где каждый день содержит массив занятий (Lesson).
 * @param filePath Путь к файлу.
 * @returns Массив дней с занятиями (`Lesson[][]`).
 */
export function parseMorningActivities(filePath: string): Lesson[][] {
    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // Разделяем файл на блоки по разделителю "---"
        const dayBlocks = fileContent.split(/\r?\n---\r?\n/);

        const allDays: Lesson[][] = [];

        // Регулярное выражение для поиска занятия (название и цель)
        const lessonRegex = /\d+\.\s*\*\*(.*?)\*\*\s*\n\s*Цель:\s*(.*)/g;
        
        for (const block of dayBlocks) {
            // Пропускаем вводные/заключительные блоки, которые не являются днями
            if (!block.trim().startsWith("###")) {
                continue;
            }

            const lessonsForDay: Lesson[] = [];
            let match;

            // Ищем все совпадения в блоке
            while ((match = lessonRegex.exec(block)) !== null) {
                const title = match[1].trim();
                const purpose = match[2].trim();
                lessonsForDay.push({ title, purpose });
            }

            if (lessonsForDay.length > 0) {
                allDays.push(lessonsForDay);
            }
        }

        return allDays;
    } catch (error) {
        console.error("Не удалось прочитать или распарсить файл с утренними активностями:", error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}