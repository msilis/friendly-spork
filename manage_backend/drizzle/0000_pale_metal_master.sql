CREATE TABLE "classes_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "classes_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"class_name" varchar,
	"class_location" varchar,
	"class_start_time" varchar,
	"class_end_time" varchar,
	"class_accompanist" integer,
	"class_students" jsonb,
	"class_teacher" jsonb
);
--> statement-breakpoint
CREATE TABLE "family_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "family_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"family_last_name" varchar NOT NULL,
	"parent1_first_name" varchar NOT NULL,
	"parent1_last_name" varchar NOT NULL,
	"parent1_email" varchar NOT NULL,
	"parent1_mobile_phone" integer NOT NULL,
	"parent2_first_name" varchar,
	"parent2_last_name" varchar,
	"parent2_email" varchar,
	"parent2_mobile_phone" integer,
	"parent1_address" varchar,
	"parent2_address" varchar,
	"alternate_contact_name" varchar,
	"alternate_contact_email" varchar,
	"alternate_contact_mobile_phone" integer
);
--> statement-breakpoint
CREATE TABLE "invoice_item_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoice_item_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"invoice_number" integer,
	"invoice_id" integer NOT NULL,
	"item_type" varchar NOT NULL,
	"item_description" varchar,
	"item_amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_table" (
	"invoice_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoice_table_invoice_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"invoice_number" integer,
	"account_id" integer NOT NULL,
	"invoice_date" varchar NOT NULL,
	"total_amount" integer NOT NULL,
	"invoice_status" varchar DEFAULT 'unpaid'
);
--> statement-breakpoint
CREATE TABLE "settings_table" (
	"settings_key" varchar PRIMARY KEY NOT NULL,
	"settings_value" varchar
);
--> statement-breakpoint
CREATE TABLE "student_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar,
	"last_name" varchar,
	"birthdate" varchar,
	"family_id" integer,
	"teacher_id" integer
);
--> statement-breakpoint
CREATE TABLE "teacher_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "teacher_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"teacher_first_name" varchar,
	"teacher_last_name" varchar,
	"teacher_email" varchar,
	"teacher_mobile_phone" integer,
	"teacher_address" varchar,
	"is_teacher_accompanist" integer
);
--> statement-breakpoint
CREATE TABLE "transaction_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transaction_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"account_id" integer,
	"transaction_date" varchar,
	"transaction_amount" integer,
	"transaction_type" integer,
	"transaction_description" varchar
);
--> statement-breakpoint
CREATE TABLE "user_table" (
	"user_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_table_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar NOT NULL,
	"hashedPassword" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classes_table" ADD CONSTRAINT "classes_table_class_accompanist_teacher_table_id_fk" FOREIGN KEY ("class_accompanist") REFERENCES "public"."teacher_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_item_table" ADD CONSTRAINT "invoice_item_table_invoice_id_invoice_table_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice_table"("invoice_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_table" ADD CONSTRAINT "invoice_table_account_id_family_table_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."family_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_table" ADD CONSTRAINT "student_table_family_id_family_table_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_table" ADD CONSTRAINT "student_table_teacher_id_teacher_table_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_table" ADD CONSTRAINT "transaction_table_account_id_family_table_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."family_table"("id") ON DELETE no action ON UPDATE no action;