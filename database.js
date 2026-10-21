import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3/dist/dexie.mjs';

export const db = new Dexie('TaskDiaryDatabase');

db.version(1).stores({
    records: 'pageID, type, title, parentID, projectID, childID, category, status, actionDate, deadlineDate, completedAt, preDeleted, preDeletedAt, diaryMemo, taskMemo, createdAt, updatedAt, email, isSaved, path, deadlineDateCheck, actionDateCheck, deadlineCustomReminderAt, isDeadlineCustomActive, isDeadline5MinBefore, isDeadline10MinBefore, isDeadline20MinBefore, isDeadline30MinBefore, isDeadline1HourBefore, isDeadline2HoursBefore, isDeadline3HoursBefore, isDeadline4HoursBefore, isDeadline5HoursBefore, isDeadline6HoursBefore, isDeadline12HoursBefore, isDeadline1DayBefore, isDeadline3DaysBefore, isDeadline5DaysBefore, isDeadline1WeekBefore, isDeadline2WeeksBefore, isDeadline1MonthBefore, actionCustomReminderAt, isActionCustomActive, isAction5MinBefore, isAction10MinBefore, isAction20MinBefore, isAction30MinBefore, isAction1HourBefore, isAction2HoursBefore, isAction3HoursBefore, isAction4HoursBefore, isAction5HoursBefore, isAction6HoursBefore, isAction12HoursBefore, isAction1DayBefore, isAction3DaysBefore, isAction5DaysBefore, isAction1WeekBefore, isAction2WeeksBefore, isAction1MonthBefore'
});

export async function runCatchUpProcessing() {
    const now = new Date();
    const allRecords = await db.records.toArray();

    for (const record of allRecords) {
        if (
            record.deadlineDate &&
            new Date(record.deadlineDate) < now &&
            record.status === 'pending'
        ) {
            await db.records.update(record.pageID, {
                status: 'overdue',
                updatedAt: now.toISOString()
            });
        }
    }
}
