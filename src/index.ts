import {
    Document,
    Packer,
    PageOrientation,
} from "docx";
import { writeFileSync } from "fs";
import { getHeader } from "./header";
import { AlignmentTypeType, Lesson, twipsPerCm } from "./types";
import mainTable from "./main-table";
import { parseDate } from "./helpers";

async function build() {
    const data = {
        theme: "",
        purpose: "",
        firstDay: "3/11",
        lastDay: undefined,
        cardNumber: 6,
        cardTitle: "Насекомые спрятались",
        gymCardNumber: 5,
        weekNumber: 5,
        morningCircleNumber: 10,
        days: [
            // Понедельник
            {
            }
        ]
    };

    const mainRowHeight = 13 * twipsPerCm;

    const firstDay = parseDate(data.firstDay);

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 720, bottom: 720, left: 720, right: 720 },
                        size: {
                            orientation: PageOrientation.LANDSCAPE,
                        },
                    },
                },
                children: [
                    ...getHeader({ theme: data.theme, purpose: data.purpose, firstDay: data.firstDay, lastDay: data.lastDay }),
                    // ОСНОВНАЯ ТАБЛИЦА
                    mainTable({ mainRowHeight, cardNumber: data.cardNumber, cardTitle: data.cardTitle, gymCardNumber: data.gymCardNumber, weekNumber: data.weekNumber, morningCircleNumber: data.morningCircleNumber, date: firstDay}),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    writeFileSync("plan-week.docx", buffer);
}

build();
