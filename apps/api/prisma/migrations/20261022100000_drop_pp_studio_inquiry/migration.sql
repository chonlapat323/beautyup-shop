-- The PP Studio service page is gone. Keep any messages it collected by filing them as
-- general contact messages, then drop the enum value.
UPDATE "Inquiry" SET "type" = 'CONTACT' WHERE "type" = 'PP_STUDIO';

-- AlterEnum
CREATE TYPE "InquiryType_new" AS ENUM ('CONTACT', 'ORDER', 'SALON', 'COURSE', 'ISSUE');
ALTER TABLE "Inquiry" ALTER COLUMN "type" TYPE "InquiryType_new" USING ("type"::text::"InquiryType_new");
ALTER TYPE "InquiryType" RENAME TO "InquiryType_old";
ALTER TYPE "InquiryType_new" RENAME TO "InquiryType";
DROP TYPE "public"."InquiryType_old";
