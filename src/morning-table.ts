import {
    AlignmentType,
    Paragraph,
    Table,
    TextRun,
} from "docx";
import { AlignmentTypeType, Lesson } from "./types";
import eveningTable from "./evening-table";


interface MorningTableProps {
    containerHeightTwips: number;
    gymCardNumber: number;
    weekNumber: number;
    morningCircleNumber: number;
    date: Date;
    lessons?: Lesson[];
    width: number;
}

export default function morningTable({ containerHeightTwips, gymCardNumber, weekNumber, morningCircleNumber, date, lessons, width }: MorningTableProps): Table {
    const month = date.toLocaleString("ru", { month: "long" });
    return eveningTable({
        containerHeightTwips: containerHeightTwips,
        suffix: [
            new Paragraph({
                alignment: AlignmentType.CENTER as AlignmentTypeType,
                children: [new TextRun({ text: `Утренняя гимнастика №${gymCardNumber} (см. картотеку за ${month})`, bold: true, font: "Calibri", size: 22 })],
                spacing: { before: 0, after: 0, line: 240 },
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER as AlignmentTypeType,
                children: [new TextRun({ text: `${weekNumber} неделя утренний круг №${morningCircleNumber}`, bold: true, font: "Calibri", size: 22 })],
                spacing: { before: 0, after: 0, line: 240 },
            }),
        ],
        game: "Игры по желанию детей",
        lessons,
        width,
    });
}
