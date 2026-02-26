# BRGY Bonbon System

A simple PHP portal for a barangay office built with Bootstrap 5 and MySQL (PDO).

## Features

- Public dashboard showing the captain's live status, announcements, and an appointment booking form.
- Administrative dashboard for updating status, posting announcements, and managing appointments.
- Responsive design with a blue and white color scheme.

## Setup

1. **Database**
   - Create a MySQL database named `brgy_connect`.
   - Run the SQL in `schema.sql` to create required tables:
     ```sql
     source schema.sql;
     ```
   - Adjust the credentials in `db.php` as needed.

2. **Web server**
   - Place the project files in your PHP-enabled server's document root (e.g., `htdocs` or `www`).
   - Ensure the `assets/css/style.css` and Bootstrap CDN are accessible.

3. **Permissions**
   - Give the web server write access if you plan to upload files (not required here).

4. **Usage**
   - Visit `index.php` for the public-facing site.
   - Visit `admin.php` to update the captain's status, post announcements, and view appointments.

## Database Tables

- `captain_status`: Latest availability info.
- `announcements`: Community posts.
- `appointments`: Resident booking requests.

## Notes

- No authentication is implemented; the admin page should be placed behind your own access control in production.
- Code is commented for clarity and easy maintenance.

## Deployment

To go live:

1. **Transfer files** – upload the entire project directory to your web server's document root.
2. **Create/Configure database** – make a MySQL database (`brgy_connect` or other) and run `schema.sql` (use phpMyAdmin, the `migrate.php` script, or CLI).
3. **Update `db.php`** – set host, username, password for the production database.
4. **Protect admin** – add authentication (HTTP auth or a login page) or restrict access by IP.
5. **Set permissions** – ensure the web server user can read (and write if needed) the project files.
6. **Point your domain** – configure DNS and a virtual host in Apache/Nginx/IIS to serve the directory.
7. **Test** – browse to your domain/`index.php` and `/admin.php` to verify functionality.

Once these steps are complete, your BRGY Bonbon System will be operational for users and administrators.
