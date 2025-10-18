import {
    AlignmentType,
    BorderStyle,
    HeightRule,
    Paragraph,
    Table,
    TableCell,
    TableLayoutType,
    TableRow,
    TextDirection,
    TextRun,
    VerticalAlign,
    WidthType,
} from "docx";
import { AlignmentTypeType, Lesson, twipsPerCm } from "./types";
import * as fs from "fs";
import * as path from "path";

interface EveningTableProps {
    containerHeightTwips: number;
    suffix?: Paragraph[];
    lessons?: Lesson[];
    game?: string;
}

/**
 * Читает файл с самостоятельной деятельностью и возвращает одну случайную строку.
 */
function getOneRandomIndependentActivity(): string {
    try {
        const filePath = path.join(__dirname, "..", "data", "Самостоятельная деятельность детей (без участия педагога).txt");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const allActivities = fileContent.split("\n").map(line => line.trim()).filter(line => line.length > 0);

        if (allActivities.length === 0) {
            return "(в файле нет данных о самостоятельной деятельности)";
        }

        const randomIndex = Math.floor(Math.random() * allActivities.length);

        return allActivities[randomIndex];
    } catch (error) {
        console.error("Не удалось прочитать файл с самостоятельной деятельностью:", error);
        return "(ошибка чтения файла)";
    }
}

export default function eveningTable({ containerHeightTwips, lessons = [], suffix = [], game }: EveningTableProps): Table {
    if (!game) {
        game = getOneRandomIndependentActivity();
    }

    // Нулевая вёрстка внутри таблицы
    const commonCellOptions = {
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
    } as const;

    const leftMergedTop = new TableCell({
        ...commonCellOptions,
        // 0.53 см = ~300 twips
        width: { size: 300, type: WidthType.DXA },
        textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
        verticalAlign: VerticalAlign.CENTER,
        rowSpan: 2,
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER as AlignmentTypeType,
                children: [new TextRun({ text: "Совместная деятельность", font: "Calibri", size: 22 /* 11 pt */ })],
                spacing: { before: 0, after: 0, line: 240 },
            }),
        ],
    });

    const rightTop = new TableCell({
        ...commonCellOptions,
        children: [
            ...lessons.map((lesson, i) => {
                const ret = [
                    new Paragraph({
                        alignment: AlignmentType.LEFT as AlignmentTypeType,
                        children: [new TextRun({ text: `${i + 1}. ${lesson.title}`, bold: true, font: "Calibri", size: 22 /* 11 pt */ })],
                        spacing: { before: 0, after: 0, line: 240 },
                    }),
                ];
                if (typeof lesson.purpose === "string") {
                    ret.push(new Paragraph({
                        alignment: AlignmentType.LEFT as AlignmentTypeType,
                        children: [new TextRun({ text: `Цель: ${lesson.purpose}`, font: "Calibri", size: 22 })],
                        spacing: { before: 0, after: 0, line: 240 },
                    }));
                }
                return ret;
            }).flat(),
            ...suffix
        ],
    });

    const rightBottom = new TableCell({
        ...commonCellOptions,
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER as AlignmentTypeType,
                children: [new TextRun({ text: "Индивидуальная работа по заданию логопеда", font: "Calibri", size: 22 })],
                spacing: { before: 0, after: 0, line: 240 },
            }),
        ],
    });

    const bottomMerged = new TableCell({
        ...commonCellOptions,
        columnSpan: 2,
        children: [
            new Paragraph({
                children: [
                    new TextRun({ text: "Самостоятельная деятельность детей (без участия педагога)", font: "Calibri", size: 22 }),
                ],
                spacing: { before: 0, after: 0, line: 240 },
                alignment: AlignmentType.CENTER as AlignmentTypeType,
            }),
            new Paragraph({
                children: [new TextRun({ text: game, font: "Calibri", size: 22 })],
                spacing: { before: 0, after: 0, line: 240 },
                alignment: AlignmentType.CENTER as AlignmentTypeType,
            }),
        ],
    });

    const lastRowHeight = Math.floor(1.5 * twipsPerCm);
    const middleRowHeight = 1 * twipsPerCm;

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        // Внешняя рамка — нет, внутренние линии — есть
        borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        },
        // Нулевые внутренние отступы на уровне таблицы (убрать белые поля вокруг содержимого)
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        columnWidths: [300, 2500],
        rows: [
            new TableRow({
                height: { rule: HeightRule.EXACT, value: containerHeightTwips - middleRowHeight - lastRowHeight },
                children: [leftMergedTop, rightTop],
            }),
            new TableRow({
                height: { rule: HeightRule.EXACT, value: middleRowHeight },
                children: [rightBottom],
            }),
            new TableRow({
                height: { rule: HeightRule.EXACT, value: lastRowHeight },
                children: [bottomMerged],
            }),
        ],
    });
}
