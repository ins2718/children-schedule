import {
    BorderStyle,
    Paragraph,
    Table,
    TableCell,
    TableLayoutType,
    TableRow,
    TextRun,
    WidthType,
} from "docx";
import * as fs from "fs";
import * as path from "path";

interface WalkTableProps {
    cardNumber: number;
    cardTitle: string;
}

/**
 * Читает файл с играми и возвращает две случайные неповторяющиеся игры.
 */
function getTwoRandomGames(): [string, string] {
    try {
        const filePath = path.join(__dirname, "..", "data", "подвижных игр для детей 5–6 лет.txt");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const allGames = fileContent.split("\n").map(line => line.trim()).filter(line => line.length > 0);

        if (allGames.length < 2) {
            return ["(в файле недостаточно игр)", ""];
        }

        // Простое перемешивание (алгоритм Фишера — Йетса)
        for (let i = allGames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allGames[i], allGames[j]] = [allGames[j], allGames[i]];
        }

        return [allGames[0], allGames[1]];
    } catch (error) {
        console.error("Не удалось прочитать файл с играми:", error);
        return ["(ошибка чтения файла игр)", ""];
    }
}

/**
 * Читает файл с опытами и возвращает случайный опыт (состоящий из двух строк).
 */
function getOneRandomExperiment(): [string, string] {
    try {
        const filePath = path.join(__dirname, "..", "data", "Опыты для детей 5 -6 лет.txt");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        // Разделяем файл на блоки по пустым строкам
        const allExperiments = fileContent
            .split(/\n\s*\n/)
            .map(block => block.trim())
            .filter(block => block.length > 0);

        if (allExperiments.length === 0) {
            return ["(в файле нет опытов)", ""];
        }

        const randomIndex = Math.floor(Math.random() * allExperiments.length);
        const experimentLines = allExperiments[randomIndex].split('\n').map(line => line.trim());
        return [experimentLines[0] || "", experimentLines[1] || ""];
    } catch (error) {
        console.error("Не удалось прочитать файл с опытами:", error);
        return ["(ошибка чтения файла опытов)", ""];
    }
}

/**
 * Читает файл с сюжетно-ролевыми и конструктивными играми,
 * и возвращает по одной случайной игре из каждой категории.
 */
function getOneRoleAndOneConstructionGame(): [string, string] {
    try {
        const filePath = path.join(__dirname, "..", "data", "Сюжетно-ролевые и конструктивные игры.txt");
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // Разделяем файл на две части по пустой строке
        const parts = fileContent.split(/\n\s*\n/);
        if (parts.length < 2) {
            console.error("Файл с сюжетно-ролевыми играми имеет неверный формат.");
            return ["(ошибка формата файла игр)", ""];
        }

        const roleGames = parts[0].split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const constructionGames = parts[1].split('\n').map(line => line.trim()).filter(line => line.length > 0);

        if (roleGames.length === 0 || constructionGames.length === 0) {
            return ["(в файле недостаточно игр)", ""];
        }

        const randomRoleGame = roleGames[Math.floor(Math.random() * roleGames.length)];
        const randomConstructionGame = constructionGames[Math.floor(Math.random() * constructionGames.length)];

        return [randomRoleGame, randomConstructionGame];
    } catch (error) {
        console.error("Не удалось прочитать файл с сюжетно-ролевыми играми:", error);
        return ["(ошибка чтения файла игр)", ""];
    }
}

/**
 * Читает файл с трудовой деятельностью и возвращает одну случайную строку.
 */
function getOneRandomLaborActivity(): [string] {
    try {
        const filePath = path.join(__dirname, "..", "data", "Трудовая деятельность.txt");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const allActivities = fileContent.split("\n").map(line => line.trim()).filter(line => line.length > 0);

        if (allActivities.length === 0) {
            return ["(в файле нет данных о трудовой деятельности)"];
        }

        const randomIndex = Math.floor(Math.random() * allActivities.length);

        return [allActivities[randomIndex]];
    } catch (error) {
        console.error("Не удалось прочитать файл с трудовой деятельностью:", error);
        return ["(ошибка чтения файла)"];
    }
}

/**
 * Читает файл с индивидуальной работой и возвращает одну случайную строку.
 */
function getOneRandomIndividualWork(): [string] {
    try {
        const filePath = path.join(__dirname, "..", "data", "Свободное общение педагога с детьми, индивидуальная работа.txt");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const allActivities = fileContent.split("\n").map(line => line.trim()).filter(line => line.length > 0);

        if (allActivities.length === 0) {
            return ["(в файле нет данных)"];
        }

        const randomIndex = Math.floor(Math.random() * allActivities.length);

        return [allActivities[randomIndex]];
    } catch (error) {
        console.error("Не удалось прочитать файл с индивидуальной работой:", error);
        return ["(ошибка чтения файла)"];
    }
}

export default function walkTable({ cardNumber, cardTitle }: WalkTableProps): Table {
    // Нулевая вёрстка внутри таблицы
    const commonCellOptions = {
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
    } as const;

    const rowTexts = [
        "Наблюдения за объектами и явлениями природы.",
        "Подвижные игры и спортивные упражнения",
        "Экспериментирование",
        "Сюжетно-ролевые и конструктивные игры",
        "Трудовая деятельность",
        "Свободное общение педагога с детьми, индивидуальная работа",
    ];

    const rowContentTexts = [
        [`Картотека. Карточка №${cardNumber}. «${cardTitle}»`],
        getTwoRandomGames(),
        getOneRandomExperiment(),
        getOneRoleAndOneConstructionGame(),
        getOneRandomLaborActivity(),
        getOneRandomIndividualWork(),
    ];

    const rows = rowTexts.map(
        (text, i) =>
            new TableRow({
                children: [
                    new TableCell({
                        ...commonCellOptions,
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text, font: "Calibri", size: 22 })],
                                spacing: { before: 0, after: 0, line: 240 },
                                alignment: "center",
                            }),
                            ...rowContentTexts[i].map(text => new Paragraph({
                                children: [new TextRun({ text, font: "Calibri", size: 22 })],
                                spacing: { before: 0, after: 0, line: 240 },
                                alignment: "center",
                            })),
                        ],
                    }),
                ],
            }),
    );

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        rows: rows,
    });
}
