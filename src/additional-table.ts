import { AlignmentType, Paragraph, Table, TableCell, TableLayoutType, TableRow, TextRun, WidthType } from "docx";
import { AlignmentTypeType } from "./types";

interface AdditionalTableProps {
    theme: string;
}

function p(text: string, bold = false) {
    return new Paragraph({
        alignment: AlignmentType.LEFT as AlignmentTypeType,
        children: [new TextRun({ text, font: "Times New Roman", size: 24, bold })],
        spacing: { before: 0, after: 0 },
    });
}

export default function additionalTable({ theme }: AdditionalTableProps): Table {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        rows: [
            new TableRow({
                height: { value: 1000, rule: "atLeast" },
                children: [
                    new TableCell({
                        columnSpan: 2,
                        children: [p("Взаимодействие с семьями", true)],
                    }),
                    new TableCell({
                        children: [
                            p("Ежедневные беседы с родителями об успехах и состоянии здоровья детей."),
                            p("Рекомендации родителям по артикуляции и автоматизации звуков у детей."),
                            p("Информация от логопедов, музыкального и физкультурного работников, медицинского работника."),
                            p("Фотоотчёт семейных работ и благодарность родителям за участие в тематической неделе."),
                        ]
                    }),
                ],
            }),
            new TableRow({
                height: { value: 1000, rule: "atLeast" },
                children: [
                    new TableCell({
                        columnSpan: 2,
                        children: [p("РППС в соответствии с заданной темой", true)],
                    }),
                    new TableCell({ children: [p("")] }),
                ],
            }),
            new TableRow({
                height: { value: 1000, rule: "atLeast" },
                children: [
                    new TableCell({
                        rowSpan: 2,
                        children: [p("Итоговое мероприятие", true)],
                    }),
                    new TableCell({
                        columnSpan: 2,
                        children: [p("")],
                    }),
                ],
            }),
            new TableRow({
                height: { value: 1000, rule: "atLeast" },
                children: [
                    new TableCell({
                        children: [p("Ответственный", true)],
                    }),
                    new TableCell({
                        children: [p("")],
                    }),
                ],
            }),
        ],
    });
}
