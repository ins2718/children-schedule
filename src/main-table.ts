import { AlignmentType, Paragraph, Table, TableCell, TableLayoutType, TableRow, TextDirection, TextRun, VerticalAlign, WidthType } from "docx";
import morningTable from "./morning-table";
import walkTable from "./walk-table";
import { AlignmentTypeType, Lesson } from "./types";
import eveningTable from "./evening-table";

interface MainTableProps {
    mainRowHeight: number;
    cardNumber: number;
    cardTitle: string;
    gymCardNumber: number;
    weekNumber: number;
    morningCircleNumber: number;
    date: Date;
}

function p(text: string, bold = false) {
    return new Paragraph({
        alignment: AlignmentType.CENTER as AlignmentTypeType,
        children: [new TextRun({ text, font: "Calibri", size: 22, bold })],
        spacing: { before: 0, after: 0 },
    });
}

const lessons: Lesson[][] = [
    [],
    [
        {
            title: "Развитие речи.",
            purpose: "",
        },
        {
            title: "Физическое развитие",
        },
        {
            title: "Развитие речи(логопед)",
        }
    ],
]

export default function mainTable({ mainRowHeight, cardNumber, cardTitle, gymCardNumber, weekNumber, morningCircleNumber, date }: MainTableProps): Table {
    const dayOfWeek = date.getDay();
    const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const dayOfWeekStr = daysOfWeek[dayOfWeek];

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        // фиксируем ширины колонок, 1-я — 0.53 см ≈ 300 twips
        columnWidths: [300, 2800, 2000, 2000, 2800],
        rows: [
            // объединённая шапка
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({
                        columnSpan: 5,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER as AlignmentTypeType,
                                children: [
                                    new TextRun({
                                        text: "Основные элементы содержания темы, предполагаемые формы проведения занятий",
                                        font: "Calibri",
                                        size: 22,
                                        bold: true,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            // заголовки колонок
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({ children: [p("Дата", true)] }),
                    new TableCell({ children: [p("Образовательная деятельность в утренний отрезок времени", true)] }),
                    new TableCell({ children: [p("Занятия", true)] }),
                    new TableCell({ children: [p("Образовательная деятельность во время прогулки", true)] }),
                    new TableCell({ children: [p("Образовательная деятельность во вторую половину дня", true)] }),
                ],
            }),
            new TableRow({
                height: { value: mainRowHeight, rule: "exact" },
                children: [
                    new TableCell({
                        width: { size: "0.53cm", type: WidthType.AUTO },
                        textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                        verticalAlign: VerticalAlign.CENTER,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER as AlignmentTypeType,
                                children: [new TextRun({ text: dayOfWeekStr, font: "Calibri", size: 22 })],
                            }),
                        ],
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                    }),
                    // вложенные таблицы «вровень», без внешней рамки, 1-я колонка слита
                    new TableCell({ margins: { top: 0, bottom: 0, left: 0, right: 0 }, children: [morningTable({ containerHeightTwips: mainRowHeight, gymCardNumber, weekNumber, morningCircleNumber, date })] }),
                    new TableCell({
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        children: lessons[dayOfWeek].flatMap((value, i) => {
                            const ret = [
                                new Paragraph({
                                    children: [new TextRun({ text: `${i + 1}. ${value.title}`, font: "Calibri", size: 22, bold: true })],
                                    spacing: { before: 0, after: 0 },
                                }),
                            ];
                            if (typeof value.purpose === "string") {
                                ret.push(new Paragraph({
                                    children: [new TextRun({ text: `Цель: ${value.purpose}`, font: "Calibri", size: 22 })],
                                    spacing: { before: 0, after: 0 },
                                }));
                            }
                            return ret;
                        }),
                    }),
                    new TableCell({ margins: { top: 0, bottom: 0, left: 0, right: 0 }, children: [walkTable({ cardNumber, cardTitle })] }),
                    new TableCell({ margins: { top: 0, bottom: 0, left: 0, right: 0 }, children: [eveningTable({ containerHeightTwips: mainRowHeight })] }),
                ],
            }),
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({ children: [p("Отметка о выполнении", true)], columnSpan: 2 }),
                    new TableCell({ children: [p("", false)], columnSpan: 3 }),
                ],
            }),
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({ children: [p("Примечания", true)], columnSpan: 2 }),
                    new TableCell({ children: [p("", false)], columnSpan: 3 }),
                ],
            }),
        ],
    });
}