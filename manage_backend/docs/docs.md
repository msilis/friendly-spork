**Routes**

*Authentication/Authorisation*

`/login` POST
`/logout` GET
`/signup` POST

*Dashboard*

`/dashboard` GET

*Student Management*

`/students/add` POST
`/students/:studentId/edit` GET/PUT
`/students/:studentId/delete` DELETE
`/students/` GET

*Family Management*

`/families/add` POST
`/families/:familyId/edit` GET/PUT
`/families/:familyId/delete` DELETE
`/families/` GET

*Teacher Management*

`/teachers/add` POST
`/teachers/:teacherId/edit` GET/PUT
`/teachers/:teacherId/delete` DELETE
`/teachers` GET

*Class Management*

`/classes/add` POST
`/classes/:classId/edit` GET/PUT
`/classes/:classId/delete` DELETE
`/classes` GET

*Misc*

Invoices

`/invoices` GET
`/invoices/add` POST
`/invoices/:invoiceId/edit` GET/PUT
`/invoices/:invoiceId/delete` DELETE

Reports

`/reports/students` GET
`/reports/teachers` GET
`/reports/families` GET
`/reports/classes` GET
`/reports/income` GET <-- TBD
