<img width="1295" alt="Screenshot 2022-09-11 at 11 48 36" src="https://github.com/aricma/cash-book/assets/22852149/c315bd8a-e39c-4a1b-a81e-2bf6e0109251">

# CashBook

The cash-book app is a project to simplify the process of keeping track of the cash in a cash register validate the dayli entries, and finally uploading them for the authorities and the busineses tax report.
With cash-book you can create accounts, transaction templates for each cash register that you want to track, and you can export the data as [csv](https://en.wikipedia.org/wiki/Comma-separated_values).

In germany you can create a coresponding template in your [DATEV](https://www.datev.de/web/de/startseite/startseite-n/?stat_Mparam=ext_sumkad_01_c-datev&gclid=CjwKCAiA04arBhAkEiwAuNOsIm6t_Mbos_ENzn8gnf8SpDBHibeI6hpb8feNH7aOce7w29H4P0DUmxoCyM0QAvD_BwE) account and you can this way upload your data directly to datev.

The project has neither central data storage nor does it have authentication. It runs completly independent in the users browser and uses the local storage to store the data on the users machine. 

⚠️ You can and should use the backup functionality to persist your data on your machine. Browsers sometimes clear their local storage and thus would loose all your data.

You can try cash-book by visiting [cash-book.aricma.app](https://cash-book.aricma.app/accounts).
