-- CreateTable
CREATE TABLE "configuracion_empresa" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "fromName" TEXT,
    "fromEmail" TEXT,
    "host" TEXT,
    "port" INTEGER,
    "secureTLS" BOOLEAN,
    "replyTo" TEXT,
    "wabaId" TEXT,
    "smtpUsername_enc" TEXT,
    "smtpPassword_enc" TEXT,
    "whatsappPhoneNumberId_enc" TEXT,
    "whatsappToken_enc" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
