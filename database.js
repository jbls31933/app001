import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3/dist/dexie.mjs';

export const db = new Dexie('TaskDiaryDatabase');

db.version(1).stores({
    records: '++id, uuid, type, title, description, status, priority, category, tags, dueDate, reminderDate, completedAt, createdAt, updatedAt, repeatInterval, repeatPattern, repeatEndDate, parentId, sortOrder, estimatedMinutes, actualMinutes, difficulty, energyLevel, mood, weather, location, cost, currency, rating, isArchived, isDeleted, customField1, customField2, customField3, customField4, customField5, syncStatus, lastSyncedAt, versionNumber, deviceId, userId, sourceApp, targetGoalId, projectCode, clientName, invoiceStatus, paymentStatus, approvalStatus, riskLevel, impactLevel, stakeholderList, attachmentCount, totalFileSize, checksumValue, signatureData, auditLog, metadataJson, extensionData1, extensionData2, extensionData3, extensionData4, extensionData5'
});

export async function runCatchUpProcessing() {
    const now = new Date();
    const allRecords = await db.records.toArray();
    
    for (const record of allRecords) {
        if (record.dueDate && new Date(record.dueDate) < now && record.status === 'pending') {
            await db.records.update(record.id, {
                status: 'overdue',
                updatedAt: now.toISOString()
            });
        }
    }
}
