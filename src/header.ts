import { AlignmentType, Paragraph, TextRun } from "docx";
import { AlignmentTypeType } from "./types";
import { parseDate } from "./helpers";

interface HeaderProps {
    theme: string;
    purpose: string;
    firstDay: string;
    lastDay?: string;
}

export function getHeader({ theme, purpose, firstDay, lastDay }: HeaderProps): Paragraph[] {
    const firstDayDate = parseDate(firstDay);

    let lastDayDate: Date;
    if (lastDay) {
        lastDayDate = parseDate(lastDay);
    } else {
        // По умолчанию — это первая пятница после (или включая) firstDayDate
        lastDayDate = new Date(firstDayDate);
        const dayOfWeek = firstDayDate.getDay(); // 0 = Вс, 1 = Пн, ..., 5 = Пт, 6 = Сб
        const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
        lastDayDate.setDate(firstDayDate.getDate() + daysUntilFriday);
    }

    const commonTextRunOptions = {
        font: "Times New Roman",
        size: 24, // 12pt
    };

    const commonParagraphOptions = {
        spacing: { after: 120 },
    };

    const dateFormatter = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long' });

    const firstDayStr = dateFormatter.format(firstDayDate);
    const lastDayStr = dateFormatter.format(lastDayDate);

    return [
        new Paragraph({
            ...commonParagraphOptions,
            alignment: AlignmentType.CENTER as AlignmentTypeType,
            children: [new TextRun({ ...commonTextRunOptions, text: "Календарно-тематический план", bold: true })],
        }),
        new Paragraph({
            ...commonParagraphOptions,
            children: [new TextRun({ ...commonTextRunOptions, text: `Тема: ${theme}` })],
        }),
        new Paragraph({
            ...commonParagraphOptions,
            children: [new TextRun({ ...commonTextRunOptions, text: `Срок изучения темы: ${firstDayStr} – ${lastDayStr}` })],
        }),
        new Paragraph({
            ...commonParagraphOptions,
            children: [
                new TextRun({
                    ...commonTextRunOptions,
                    text: `Цель: ${purpose}`,
                }),
            ],
        }),
    ];
}