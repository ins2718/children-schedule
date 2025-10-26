import {
    Document,
    Packer,
    PageOrientation,
    Paragraph,
} from "docx";
import { writeFileSync } from "fs";
import { getHeader } from "./header";
import { twipsPerCm } from "./types";
import mainTable from "./main-table";
import { parseDate } from "./helpers";
import { parseMorningActivities } from "./parsers";
import * as path from "path";
import additionalTable from "./additional-table";

async function build() {
    const morningActivitiesPath = path.join(__dirname, "..", "data", "morning.txt");
    const morningActivitiesByDay = parseMorningActivities(morningActivitiesPath);
    const eveningActivitiesPath = path.join(__dirname, "..", "data", "evening.txt");
    const eveningActivitiesByDay = parseMorningActivities(eveningActivitiesPath);
    const data = {
        theme: "Одежда. Обувь. Головные уборы.",
        purpose: "расширять представления детей о назначении и разнообразии одежды, обуви и головных уборов, формировать умение подбирать их по сезону и ситуации, воспитывать аккуратность и бережное отношение к личным вещам.",
        firstDay: "3/11",
        lastDay: undefined,
        cardNumber: 7,
        cardTitle: "Птицы улетают",
        gymCardNumber: 1,
        weekNumber: 1,
        morningCircleNumber: 11,
    };

    const mainRowHeight = 13 * twipsPerCm;

    const firstDay = parseDate(data.firstDay);

    const pageWidthTwips = 16838; // Ширина страницы A4 в ландшафтном режиме в twips
    const marginLeftTwips = 720;
    const marginRightTwips = 720;
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 720, bottom: 720, left: marginLeftTwips, right: marginRightTwips },
                        size: {
                            orientation: PageOrientation.LANDSCAPE,
                        },
                    },
                },
                children: [
                    ...getHeader({ theme: data.theme, purpose: data.purpose, firstDay: data.firstDay, lastDay: data.lastDay }),
                    // ОСНОВНАЯ ТАБЛИЦА
                    ...morningActivitiesByDay.map((_, i) => {
                        const date = new Date(firstDay);
                        date.setDate(firstDay.getDate() + i);

                        const ret = [
                            mainTable({ mainRowHeight: mainRowHeight + (i === 0 ? 0 : 1 * twipsPerCm), cardNumber: data.cardNumber, cardTitle: data.cardTitle, gymCardNumber: data.gymCardNumber, weekNumber: data.weekNumber, morningCircleNumber: data.morningCircleNumber, date, morningLessons: morningActivitiesByDay[i], eveningLessons: eveningActivitiesByDay[i], widthTwips: pageWidthTwips - marginLeftTwips - marginRightTwips }),
                            new Paragraph({ pageBreakBefore: true, }),
                        ];
                        return ret;
                    }).flat(),
                    additionalTable({ theme: data.theme }),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    writeFileSync("plan-week.docx", buffer);
}

build();
